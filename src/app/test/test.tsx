import React from 'react';
import { Graph } from 'react-d3-graph';

// Example data for the graph
const data = {
    nodes: [
        { id: 'vitalik_eth' },
        { id: '0x6d8a...896045' },
        { id: '0xcc6d...78d2a2' },
    ],
    links: [
        { source: 'vitalik_eth', target: '0x6d8a...896045', label: '0.5 ETH' },
        { source: 'vitalik_eth', target: '0xcc6d...78d2a2', label: '0.2 ETH' },
    ],
};

// Graph configuration
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 120,
        highlightStrokeColor: 'blue',
    },
    link: {
        highlightColor: 'lightblue',
        renderLabel: true,
    },
};

const MoneyFlowChart = () => {
    return (
        <div>
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
            />
        </div>
    );
};

export default MoneyFlowChart;