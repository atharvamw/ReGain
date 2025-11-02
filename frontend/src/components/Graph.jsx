import React, { useEffect, useRef } from "react";
// ✅ Fixed import for Vite — no missing specifier error
import { DataSet, Network } from "vis-network/standalone";

const ReGainNetwork = ({
  width = "100%",
  height = "600px",
  nodes = [],
  edges = []
}) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodeData = new DataSet(nodes);
    const rawEdges = edges;

    const maxDistance = Math.max(...rawEdges.map(e => e.distance || 1));
    const minDistance = Math.min(...rawEdges.map(e => e.distance || 0));

    const edgeData = new DataSet(
      rawEdges.map((e, i) => {
        const relative = 1 - (e.distance - minDistance) / (maxDistance - minDistance);
        const isCentral = e.from === 0 || e.to === 0;
        const width = isCentral ? 2 + relative * 4 : 1;
        const opacity = isCentral ? 1 : 0.5;
        const length = 100 + (e.distance - minDistance) * 50;
        const dashes = !isCentral;
        const color = isCentral ? e.baseColor || "#f1c40f" : "rgba(255,255,255,0.3)";

        return {
          id: i,
          from: e.from,
          to: e.to,
          label: `${e.distance} km`,
          width,
          length,
          dashes,
          color: { color, opacity },
          font: {
            size: 13,
            color: isCentral ? "#eee" : "rgba(255,255,255,0.6)",
            align: "top",
            face: "Poppins",
            vadjust: -2,
            strokeWidth: 0
          },
          smooth: { type: "dynamic" },
          shadow: false
        };
      })
    );

    const data = { nodes: nodeData, edges: edgeData };

    const options = {
      nodes: {
        shape: "dot",
        size: 25,
        color: {
          border: "#f39c12",
          background: "#f1c40f",
          highlight: { border: "#f1c40f", background: "#f39c12" }
        },
        font: { color: "#fff", size: 16 },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        shadow: false,
        smooth: { type: "continuous" }
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.4,
          springConstant: 0.04,
          damping: 0.09
        }
      },
      layout: {
        improvedLayout: true,
        randomSeed: 42
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    // Keep central node centered
    network.once("stabilized", () => {
      const pos = network.getPositions(0);
      network.moveTo({
        position: pos[0],
        scale: 1.3,
        animation: { duration: 1000, easingFunction: "easeInOutQuad" }
      });
    });

    // Hover highlight for central routes
    network.on("hoverNode", params => {
      const connectedEdges = network.getConnectedEdges(params.node);
      connectedEdges.forEach(edgeId => {
        const e = edgeData.get(edgeId);
        if (e.from === 0 || e.to === 0)
          edgeData.update({ id: edgeId, width: e.width + 2 });
      });
    });

    network.on("blurNode", () => {
      rawEdges.forEach((e, i) => {
        const relative = 1 - (e.distance - minDistance) / (maxDistance - minDistance);
        const isCentral = e.from === 0 || e.to === 0;
        edgeData.update({ id: i, width: isCentral ? 2 + relative * 4 : 1 });
      });
    });

    return () => network.destroy();
  }, [nodes, edges]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        background: "radial-gradient(circle at center, #2c3e50, #1c1c1c)",
        borderRadius: "10px",
        overflow: "hidden",
        border: "2px solid #f1c40f",
        boxShadow: "0 0 20px rgba(255, 193, 7, 0.3)"
      }}
    />
  );
};

export default ReGainNetwork;
