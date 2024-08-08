'use client'

import React from 'react';
import { Graph } from 'react-d3-graph';


// Example data for the graph
const data = {
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
};

// Graph configuration
const myConfig = {
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    directed: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: false,
    maxZoom: 8,
    minZoom: 0.1,
    nodeHighlightBehavior: false,
    panAndZoom: true,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 800,
    d3: {
        alphaTarget: 0.05,
        gravity: -100,
        linkLength: 100,
        linkStrength: 1,
        disableLinkForce: false
    },
    node: {
        color: 'purple',
        fontColor: 'black',
        fontSize: 8,
        fontWeight: 'normal',
        highlightColor: 'SAME',
        highlightFontSize: 8,
        highlightFontWeight: 'normal',
        highlightStrokeColor: 'SAME',
        highlightStrokeWidth: 'SAME',
        labelProperty: 'id',
        mouseCursor: 'pointer',
        opacity: 1,
        renderLabel: true,
        size: 200,
        strokeColor: 'none',
        strokeWidth: 1.5,

        symbolType: 'circle'
    },
    link: {
        color: 'white',
        fontColor: 'black',
        fontSize: 8,
        fontWeight: 'normal',
        highlightColor: 'SAME',
        highlightFontSize: 8,
        highlightFontWeight: 'normal',
        labelProperty: 'label',
        mouseCursor: 'pointer',
        opacity: 1,
        renderLabel: false,
        semanticStrokeWidth: false,
        strokeWidth: 1.5,
        markerHeight: 6,
        markerWidth: 6,
        strokeDasharray: 0,
        strokeDashoffset: 0,
        strokeLinecap: 'butt'
    }
};
const onClickGraph = function (event) {
    window.alert('Clicked the graph background');
};

const onClickNode = function (nodeId, node) {
    window.alert('Clicked node ${nodeId} in position (${node.x}, ${node.y})');
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
    window.alert(`Clicked link between ${source} and ${target}`);
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

const onNodePositionChange = function (nodeId, x, y) {
    window.alert(`Node ${nodeId} moved to new position x= ${x} y= ${y}`);
};

// Callback that's called whenever the graph is zoomed in/out
// @param {number} previousZoom the previous graph zoom
// @param {number} newZoom the new graph zoom
const onZoomChange = function (previousZoom, newZoom) {
    window.alert(`Graph is now zoomed at ${newZoom} from ${previousZoom}`);
};

const Flowtest = () => {
    return (
        <div>
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}


                onRightClickLink={onRightClickLink}

                onNodePositionChange={onNodePositionChange}
                onZoomChange={onZoomChange}
            />
        </div>
    );
};

export default Flowtest;
