

'use client'

import React, { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';
import { tree as d3Tree, hierarchy } from 'd3-hierarchy';

// Chuyển đổi dữ liệu đồ thị thành dữ liệu cây phân cấp
const convertToTree = (data) => {
    const nodeMap = new Map();
    const root = { id: 'root', children: [] };

    // Thêm tất cả các nút vào bản đồ
    data.nodes.forEach(node => nodeMap.set(node.id, { id: node.id, children: [] }));

    // Xây dựng cấu trúc cây phân cấp
    data.links.forEach(link => {
        const parentNode = nodeMap.get(link.source);
        const childNode = nodeMap.get(link.target);

        if (parentNode && childNode) {
            if (!parentNode.children) parentNode.children = [];
            parentNode.children.push(childNode);
        }
    });

    // Thêm các nút gốc vào root
    root.children = Array.from(nodeMap.values()).filter(node => !data.links.some(link => link.target === node.id));

    return root;
};

const transformData = (data) => {
    const root = hierarchy(convertToTree(data));
    const treeLayout = d3Tree().size([1000, 1000]);
    treeLayout(root);

    const nodes = root.descendants()
        .filter(d => d.data.id !== 'root') // Loại bỏ nút gốc
        .map(d => ({
            id: d.data.id,
            x: d.y,
            y: d.x,
            label: d.data.id,
        }));

    const links = root.links()
        .map(d => ({
            source: d.source.data.id,
            target: d.target.data.id,
        }))
        .filter(link => link.source !== 'root' && link.target !== 'root'); // Loại bỏ liên kết liên quan đến nút gốc

    return { nodes, links };
};

const MoneyFlowChart = () => {
    const [GraphComponent, setGraphComponent] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [nodePositions, setNodePositions] = useState({});

    useEffect(() => {
        import('react-d3-graph').then((module) => {
            if (module && module.Graph) {
                console.log('GraphComponent:', module.Graph);
                setGraphComponent(() => module.Graph);
            } else {
                console.error("Failed to load Graph component");
            }
        });

        const data = transformData({
            nodes: [
                { id: 'vitalik_eth' },
                { id: '0x6d8a...8960a5' },
                { id: '0xcc6d...78d222' },
                { id: '0x1234...abcd12' },
                { id: '0x5678...efgh34' },
                { id: '0x5644...edsad4' },
                { id: '0x5644...edssd4' },
                { id: '0x5s44...edssd4' },
                { id: '0x1s44...edssd4' },
                { id: '0xks44...edssd4' },
            ],
            links: [
                { source: 'vitalik_eth', target: '0x6d8a...8960a5', label: '0.5 ETH' },
                { source: 'vitalik_eth', target: '0xcc6d...78d222', label: '0.7 ETH' },
                { source: 'vitalik_eth', target: '0x5678...efgh34', label: '0.7 ETH' },
                { source: '0x6d8a...8960a5', target: '0x1234...abcd12', label: '0.3 ETH' },
                { source: '0x6d8a...8960a5', target: '0x5678...efgh34', label: '0.4 ETH' },
                { source: '0xcc6d...78d222', target: '0x5644...edsad4', label: '0.4 ETH' },
                { source: '0xcc6d...78d222', target: '0x5644...edssd4', label: '0.4 ETH' },
                { source: '0x5644...edsad4', target: '0x1s44...edssd4', label: '0.4 ETH' },
                { source: '0xcc6d...78d222', target: '0x5s44...edssd4', label: '0.4 ETH' },
                { source: '0x1234...abcd12', target: '0x1s44...edssd4', label: '0.4 ETH' },
                { source: '0x1s44...edssd4', target: '0xks44...edssd4', label: '0.4 ETH' },
            ],
        });

        setGraphData(data);
        console.log('Graph Data', data);


    }, []);
    const onNodePositionChange = (nodeId, x, y) => {
        setNodePositions(prevPositions => ({
            ...prevPositions,
            [nodeId]: { x, y },
        }));
        console.log(`Node ${nodeId} moved to new position x=${x}, y=${y}`);
    };

    if (!GraphComponent || !graphData) {
        return <div>Loading...</div>;
    }

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: 'purple',
            size: 800,
            symbolType: "diamond",
            labelProperty: 'label',
            renderLabel: true,
            fontSize: 14,
            fontWeight: 'bold',
            labelPosition: 'top',
            strokeWidth: 10,
            mouseCursor: 'crosshair',
        },
        link: {
            highlightColor: 'blue',
            renderLabel: true,
            strokeWidth: 2,
            color: 'white',
            labelProperty: 'label',
            semanticStrokeWidth: true,
            markerHeight: 6,
            markerWidth: 20,
            strokeLinecap: 'square',
        },
        directed: true,
        staticGraph: false,
        freezeAllDragEvents: false,
        width: 1600,
        height: 950,
        panAndZoom: true,
        zoomScaleExtent: [0.1, 8],
        focusZoom: 1,
        highlightDegree: 2,
    };
    const onClickGraph = function (event) {
        window.alert('Clicked the graph background');
    };

    const onClickNode = function (nodeId, node) {
        window.alert(`Clicked node ${nodeId} in position (${node.x}, ${node.y})`);
    };

    const onDoubleClickNode = function (nodeId, node) {
        window.alert('Double clicked node ${nodeId} in position (${node.x}, ${node.y})');
    };

    const onRightClickNode = function (event, nodeId, node) {
        window.alert('Right clicked node ${nodeId} in position (${node.x}, ${node.y})');
    };

    const onMouseOverNode = function (nodeId, node) {
        window.alert(`Mouse over node ${nodeId} in position (${node.x}, ${node.y})`);
    };

    const onMouseOutNode = function (nodeId, node) {
        window.alert(`Mouse out node ${nodeId} in position (${node.x}, ${node.y})`);
    };

    const onClickLink = function (source, target) {
        window.alert(`'Clicked link between ${source} and ${target}`);
    };

    const onRightClickLink = function (event, source, target) {
        window.alert('Right clicked link between ${source} and ${target}');
    };

    const onMouseOverLink = function (source, target) {
        window.alert(`Mouse over in link between ${source} and ${target}`);
    };

    const onMouseOutLink = function (source, target) {
        window.alert(`Mouse out link between ${source} and ${target}`);
    };



    // Callback that's called whenever the graph is zoomed in/out
    // @param {number} previousZoom the previous graph zoom
    // @param {number} newZoom the new graph zoom
    const onZoomChange = function (previousZoom, newZoom) {
        window.alert(`Graph is now zoomed at ${newZoom} from ${previousZoom}`);
    };

    return (
        <div className="tree-container">
            <Graph
                id="graph-id"
                data={graphData}
                config={myConfig}
                onClickNode={(nodeId, node) => window.alert(`Clicked node ${nodeId} in position (${node.x}, ${node.y})`)}
                onClickLink={(source, target) => window.alert(`Clicked link between ${source} and ${target}`)}
                onNodePositionChange={onNodePositionChange}
            />
        </div>
    );
};

export default MoneyFlowChart;

