import React, { useCallback, useState, useRef, useEffect, forwardRef, useImperativeHandle  } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
  Handle,
  Position,
  useReactFlow, // This hook is still used inside DiagramCanvas for fitView etc.
} from 'reactflow';
import 'reactflow/dist/style.css'; // React Flow styles
import { toPng } from 'html-to-image'; // Import html-to-image for reliable screenshot
// import * as domToImage from 'dom-to-image'; // Alternative for screenshot if html-to-image has issues
import { useNavigate } from 'react-router-dom'; 
// Utility function to convert color names to hex for input[type="color"] compatibility
// This is still useful as the user can input color names, and the color picker expects hex.
const colorNameToHex = (color) => {
  const colors = {
    'black': '#000000',
    'white': '#27FFC5FF',
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'orange': '#FFA500',
    'gray': '#808080',
    'lightcoral': '#F08080',
    // Add more named colors as needed
  };

  // If it's a named color, return its hex value
  if (colors[color.toLowerCase()]) {
    return colors[color.toLowerCase()];
  }
  // If it's already a hex or rgba, return as is (browser will handle rgba, but input[type="color"] prefers hex)
  // This also handles if `color` is a CSS variable string like `var(--color-node-bg)`
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('var(')) {
    return color; // Let the browser/CSS handle the variable. input[type="color"] might not render it correctly though.
  }
  // Default to black if unknown named color or invalid input
  return '#000000';
};

// Custom Modal Component for prompts and confirmations
const Modal = ({ show, title, message, inputType, inputValue, onConfirm, onCancel, children }) => {
  if (!show) return null;

  const [value, setValue] = useState(inputValue || '');

  const handleConfirm = () => {
    onConfirm(inputType ? value : true);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="modal-bg rounded-lg shadow-xl p-6 w-full max-w-sm border modal-border">
        <h3 className="text-xl font-semibold mb-4 modal-text">{title}</h3>
        {message && <p className="mb-4 modal-info-text">{message}</p>}
        {inputType === 'text' && (
          <input
            type="text"
            className="w-full p-2 border input-border rounded-md mb-4 input-focus-ring input-bg input-text-color"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        )}
        {inputType === 'color' && (
          <input
            type="color"
            className="w-full p-2 border input-border rounded-md mb-4 h-12"
            value={colorNameToHex(value)} // Ensure hex format for input[type="color"]
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        {children}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 modal-button-bg modal-button-text rounded-md modal-button-hover-bg transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 btn-primary-gradient btn-primary-text rounded-md transition duration-150 ease-in-out"
          >
            {inputType ? 'Save' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Node Component for Rectangle
const CustomRectangleNode = ({ data, selected }) => {
  return (
    <div
      className={`p-3 rounded-lg shadow-md transition-all duration-100 ease-in-out ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        background: data.color || 'var(--color-node-bg)', // Default node background
        color: data.textColor || 'var(--color-node-text)', // Default node text color
        fontWeight: data.fontWeight || 'normal',
        width: data.nodeWidth ? `${data.nodeWidth}px` : 'auto',
        height: data.nodeHeight ? `${data.nodeHeight}px` : 'auto',
        minWidth: '120px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: data.border || 'none', // Border is a separate property for now
        fontFamily: 'Inter, sans-serif',
        padding: '8px 12px',
        fontSize: data.fontSize ? `${data.fontSize}px` : '12px',
        position: 'relative',
      }}
    >
      {/* ReactFlow handles now use a variable-friendly background color for consistency */}
      <Handle type="target" position={Position.Top} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <span
        style={{
          transform: `translate(${data.textOffsetX || 0}px, ${data.textOffsetY || 0}px)`,
          display: 'block',
          textAlign: 'center',
          wordBreak: 'break-word',
          zIndex: 1,
        }}
      >
        {data.label}
      </span>
    </div>
  );
};

// Custom Node Component for Circle
const CustomCircleNode = ({ data, selected }) => {
  return (
    <div
      className={`p-3 rounded-full shadow-md transition-all duration-100 ease-in-out ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        background: data.color || 'var(--color-node-bg)', // Default node background
        color: data.textColor || 'var(--color-node-text)', // Default node text color
        fontWeight: data.fontWeight || 'normal',
        width: data.nodeWidth ? `${data.nodeWidth}px` : '100px',
        height: data.nodeHeight ? `${data.nodeHeight}px` : '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: data.border || 'none',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        wordBreak: 'break-word',
        padding: '8px',
        fontSize: data.fontSize ? `${data.fontSize}px` : '12px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-[var(--color-icon)] !w-3 !h-3" />
      <span
        style={{
          transform: `translate(${data.textOffsetX || 0}px, ${data.textOffsetY || 0}px)`,
          display: 'block',
          textAlign: 'center',
          wordBreak: 'break-word',
          zIndex: 1,
        }}
      >
        {data.label}
      </span>
    </div>
  );
};

// Custom Node Component for Diamond
const CustomDiamondNode = ({ data, selected }) => {
  return (
    <div
      className={`shadow-md transition-all duration-100 ease-in-out ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        background: data.color || 'var(--color-node-bg)', // Default node background
        color: data.textColor || 'var(--color-node-text)', // Default node text color
        fontWeight: data.fontWeight || 'normal',
        width: data.nodeWidth ? `${data.nodeWidth}px` : '120px',
        height: data.nodeHeight ? `${data.nodeHeight}px` : '120px',
        transform: 'rotate(45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: data.border || 'none',
        fontFamily: 'Inter, sans-serif',
        padding: '8px',
        fontSize: data.fontSize ? `${data.fontSize}px` : '12px',
        position: 'relative',
      }}
    >
      {/* Handles need to be rotated back if placed directly on the diamond div */}
      <Handle type="target" position={Position.Top} className="!bg-[var(--color-icon)] !w-3 !h-3" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="target" position={Position.Left} className="!bg-[var(--color-icon)] !w-3 !h-3" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--color-icon)] !w-3 !h-3" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Right} className="!bg-[var(--color-icon)] !w-3 !h-3" style={{ transform: 'rotate(-45deg)' }} />
      <span
        style={{
          transform: `rotate(-45deg) translate(${data.textOffsetX || 0}px, ${data.textOffsetY || 0}px)`, // Apply text offset after rotating back
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          textAlign: 'center',
          wordBreak: 'break-word',
          zIndex: 1,
        }}
      >
        {data.label}
      </span>
    </div>
  );
};

// Custom Node Component for an Arrow (standalone shape)
const CustomArrowNode = ({ data, selected }) => {
  const arrowHeadPath = {
    'Closed': 'M0,0 L-5,-5 L-5,5 Z', // Closed triangle
    'Open': 'M0,0 L-5,-5 M0,0 L-5,5', // V-shape
    'None': '', // No arrowhead
  };

  const svgWidth = data.nodeWidth || 150;
  const svgHeight = data.nodeHeight || 50;
  const lineEndY = svgHeight / 2;
  const arrowheadOffset = 10;
  const lineEndX = svgWidth - arrowheadOffset;

  return (
    <div
      className={`shadow-md transition-all duration-100 ease-in-out ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transform: `rotate(${data.rotation || 0}deg)`,
      }}
    >
      {/* Arrow SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          overflow: 'visible',
        }}
      >
        {/* Arrow line */}
        <line
          x1="0" y1={lineEndY}
          x2={lineEndX} y2={lineEndY}
          stroke={data.color || 'var(--color-border)'} // Default edge color
          strokeWidth="2"
        />
        {/* Arrowhead */}
        <path
          d={arrowHeadPath[data.arrowheadStyle || 'Closed']}
          transform={`translate(${lineEndX},${lineEndY})`}
          fill={data.arrowheadColor || data.color || 'var(--color-border)'} // Default arrowhead color
          stroke={data.arrowheadColor || data.color || 'var(--color-border)'}
          strokeWidth={data.arrowheadStyle === 'Open' ? '2' : '0'}
        />
      </svg>
      {/* Text Label - Keep it if user still wants to label arrows visually, but default to empty */}
      {data.label && (
        <span
          style={{
            position: 'absolute',
            color: data.textColor || 'var(--color-node-text)', // Default text color
            fontWeight: data.fontWeight || 'normal',
            fontSize: data.fontSize ? `${data.fontSize}px` : '12px',
            transform: `translate(${data.textOffsetX || 0}px, ${data.textOffsetY || 0}px) rotate(${-(data.rotation || 0)}deg)`,
            whiteSpace: 'nowrap',
            zIndex: 1,
          }}
        >
          {data.label}
        </span>
      )}
    </div>
  );
};


// Define node types for ReactFlow outside the component to prevent re-creation on every render
const nodeTypes = {
  rectangle: CustomRectangleNode,
  circle: CustomCircleNode,
  diamond: CustomDiamondNode,
  arrow: CustomArrowNode, // New arrow node type
};

// DiagramCanvas component now contains the ReactFlow instance and logic dependent on useReactFlow
const DiagramCanvas = forwardRef(({
  nodes, onNodesChange,
  edges, onEdgesChange,
  onConnect,
  onNodeClick, onEdgeClick, onPaneClick,
  onElementContextMenu,
  canvasTitle,
  error,
}, ref) => {

  const reactFlowInstance = useReactFlow(); // Get the ReactFlow instance using the hook
  const diagramWrapperRef = useRef(null); // Ref to the div wrapping ReactFlow for html-to-image

  // Expose specific functions via ref
  useImperativeHandle(ref, () => ({
    fitView: () => {
      // Use reactFlowInstance's fitView
      if (reactFlowInstance && typeof reactFlowInstance.fitView === 'function') {
        reactFlowInstance.fitView();
      } else {
        console.warn('fitView not available from ReactFlow instance.');
      }
    },
    // Using html-to-image for reliable PNG export
    toPng: () => {
      if (diagramWrapperRef.current) {
        return toPng(diagramWrapperRef.current, {
          backgroundColor: 'var(--color-section-bg)', // Set background to white/theme background for PNG export
          cacheBust: true,
        });
      } else {
        console.warn('Diagram wrapper ref not available for PNG export.');
        return Promise.reject('Diagram not ready for PNG export.');
      }
    },
    // applyLayout uses fitView, so it can also rely on the reactFlowInstance
    applyLayout: () => {
      if (reactFlowInstance && typeof reactFlowInstance.fitView === 'function') {
        reactFlowInstance.fitView();
      } else {
        console.warn('fitView not available for layout from ReactFlow instance.');
      }
      alert('Applying tree layout (conceptual). In a full build, this would use a layout library like ELK or Dagre to arrange nodes automatically.');
    },
  }), [reactFlowInstance]); // Dependency array only includes reactFlowInstance for its methods

  return (
    // Wrap ReactFlow with a div and attach the ref for html-to-image
    <div className="flex-grow relative bg-[var(--color-section-bg)]" ref={diagramWrapperRef}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onElementContextMenu}
            onEdgeContextMenu={onElementContextMenu}
            nodeTypes={nodeTypes} // Pass memoized nodeTypes
            fitView // This prop ensures auto-fit on initial load/changes within ReactFlow itself
            attributionPosition="bottom-left"
        >
            <Background variant="dots" gap={12} size={1} className="!bg-[var(--color-section-bg)]" />
            <Controls className="!border panel-border !rounded-lg !shadow-sm panel-bg" />
            <MiniMap
                nodeColor={(n) => n.data?.color || 'var(--color-node-bg)'}
                className="!bg-[var(--color-button-secondary-bg)] !rounded-lg !opacity-90"
            />

            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl font-serif font-bold text-primary-color pointer-events-none z-10">
                {canvasTitle}
            </div>

            {error && (
              <div className="absolute top-28 left-1/2 -translate-x-1/2 message-bg border message-border message-text px-4 py-3 rounded relative max-w-sm mx-auto shadow-md" role="alert" style={{ zIndex: 100 }}>
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
        </ReactFlow>
    </div>
  );
});


// Main App component
const Mindmap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesState] = useEdgesState([]); // Use useEdgesState for edges
  const navigate = useNavigate(); 
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canvasTitle, setCanvasTitle] = useState('AI Generated Diagram');
  const [diagramType, setDiagramType] = useState('Flow Chart');

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '', message: '', inputType: null, inputValue: '', onConfirm: () => {}, onCancel: () => {},
  });
  const [selectedElementId, setSelectedElementId] = useState(null);

  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [activeLeftPanelTab, setActiveLeftPanelTab] = useState('shapes');

  // History state for undo/redo
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const isRestoring = useRef(false); // Flag to prevent recording history when undo/redo is happening

  const selectedNode = selectedElementId ? nodes.find(n => n.id === selectedElementId) : null;
  const selectedEdge = selectedElementId ? edges.find(e => e.id === selectedElementId) : null;

  const diagramCanvasRef = useRef(null); // Ref for DiagramCanvas component

  /**
   * Generates a unique ID for nodes and edges.
   */
  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Initialize history with initial empty state
  useEffect(() => {
    // Only initialize if history is empty (first render)
    if (history.length === 0) {
      setHistory([{ nodes: [], edges: [] }]);
      setHistoryPointer(0);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save history when nodes or edges change
  // This effect will run after every update to nodes or edges, except when `isRestoring` is true
  useEffect(() => {
    if (isRestoring.current) {
      isRestoring.current = false; // Reset the flag after restoration
      return;
    }
    // Trim history if a new change occurs after undoing
    const newHistory = history.slice(0, historyPointer + 1);
    const newSnapshot = { nodes, edges };
    setHistory([...newHistory, newSnapshot]);
    setHistoryPointer(newHistory.length); // Points to the new last element
  }, [nodes, edges]); // Depend on nodes and edges to trigger history updates

  // Custom onNodesChange handler to ensure history is updated only when user makes changes
  const customOnNodesChange = useCallback((changes) => {
    if (!isRestoring.current) { // Only apply changes and record history if not restoring
      onNodesChange(changes);
    }
  }, [onNodesChange]);

  // Custom onEdgesChange handler
  const customOnEdgesChange = useCallback((changes) => {
    if (!isRestoring.current) { // Only apply changes and record history if not restoring
      onEdgesState(changes); // use onEdgesState for edges
    }
  }, [onEdgesState]);


  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyPointer > 0) {
      isRestoring.current = true; // Set flag to prevent history recording during restore
      const previousState = history[historyPointer - 1];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setHistoryPointer(prev => prev - 1);
    }
  }, [history, historyPointer, setNodes, setEdges]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      isRestoring.current = true; // Set flag to prevent history recording during restore
      const nextState = history[historyPointer + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryPointer(prev => prev + 1);
    }
  }, [history, historyPointer, setNodes, setEdges]);


  /**
   * Adds a new node of a specific shape.
   */
  const addShape = (shapeType) => {
    const id = generateId();
    let newNode = {
      id,
      position: { x: 150, y: 150 },
      // Set default text color, font weight, and initial size for new nodes
      data: {
        label: shapeType === 'arrow' ? '' : `New ${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`, // No default label for arrows
        color: 'var(--color-node-bg)', // Default node background color
        textColor: 'var(--color-node-text)', // Default node text color
        fontWeight: 'normal',
        nodeWidth: (shapeType === 'rectangle' ? 150 : (shapeType === 'circle' ? 100 : (shapeType === 'diamond' ? 120 : 150))), // Default width for rectangle/circle/diamond/arrow
        nodeHeight: (shapeType === 'rectangle' ? 80 : (shapeType === 'circle' ? 100 : (shapeType === 'diamond' ? 120 : 50))), // Default height for rectangle/circle/diamond/arrow
        fontSize: 14, // Default font size
        textOffsetX: 0, // Initial text offset X
        textOffsetY: 0, // Initial text offset Y
        // Arrow specific defaults (only apply if shapeType is 'arrow')
        rotation: 0,
        arrowheadStyle: 'Closed',
        arrowheadColor: 'var(--color-border)', // Default arrowhead color
      },
      type: shapeType,
      zIndex: 10,
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedElementId(newNode.id);
  };

  /**
   * Callback for when an edge is created.
   */
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({
        ...params,
        id: generateId(),
        animated: true,
        type: 'smoothstep', // Default edge type
        markerEnd: {
          type: MarkerType.ArrowClosed, // Default arrowhead type
          color: 'var(--color-border)', // Default arrowhead color
        },
      }, eds))
    },
    [setEdges]
  );

  /**
   * Handles click on a node.
   */
  const onNodeClick = useCallback((event, node) => {
    setSelectedElementId(node.id);
  }, []);

  /**
   * Handles click on an edge.
   */
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedElementId(edge.id);
  }, []);

  /**
   * Handles background (pane) click.
   */
  const onPaneClick = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  /**
   * Deletes the specified node or edge.
   */
  const deleteSelectedElement = useCallback((idToDelete = selectedElementId) => {
    if (!idToDelete) return;

    const isNode = nodes.some(n => n.id === idToDelete);
    if (isNode) {
      setNodes((nds) => nds.filter((n) => n.id !== idToDelete));
      setEdges((eds) => eds.filter((e) => e.source !== idToDelete && e.target !== idToDelete));
    } else {
      setEdges((eds) => eds.filter((e) => e.id !== idToDelete));
    }
    setSelectedElementId(null);
  }, [selectedElementId, nodes, edges, setNodes, setEdges]);

  /**
   * Handles right-click (context menu) on a node or edge.
   */
  const onElementContextMenu = useCallback((event, element) => {
    event.preventDefault();
    setSelectedElementId(element.id);
    const isNode = nodes.some(n => n.id === element.id);
    const elementType = isNode ? 'Node' : 'Edge';
    const elementLabel = isNode ? element.data.label : `Edge ${element.source}-${element.target}`;

    setModalConfig({
      title: `Delete ${elementType}`,
      message: `Are you sure you want to delete "${elementLabel}"?`,
      inputType: null,
      onConfirm: () => {
        deleteSelectedElement(element.id);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  }, [setModalConfig, deleteSelectedElement, nodes]);

  /**
   * Updates the label of the selected node.
   */
  const updateNodeLabel = (newLabel) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
  };

  /**
   * Updates the background color of the selected node.
   */
  const updateNodeColor = (newColor) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, color: newColor } }
          : n
      )
    );
  };

  /**
   * Updates the text color of the selected node.
   */
  const updateNodeTextColor = (newTextColor) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, textColor: newTextColor } }
          : n
      )
    );
  };

  /**
   * Updates the font weight of the selected node.
   */
  const updateNodeFontWeight = (newFontWeight) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, fontWeight: newFontWeight } }
          : n
      )
    );
  };

  /**
   * Updates the width of the selected node.
   */
  const updateNodeWidth = (newWidth) => {
    if (!selectedElementId || isNaN(newWidth) || newWidth <= 0) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, nodeWidth: parseFloat(newWidth) } }
          : n
      )
    );
  };

  /**
   * Updates the height of the selected node.
   */
  const updateNodeHeight = (newHeight) => {
    if (!selectedElementId || isNaN(newHeight) || newHeight <= 0) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, nodeHeight: parseFloat(newHeight) } }
          : n
      )
    );
  };

  /**
   * Updates the font size of the selected node.
   */
  const updateNodeFontSize = (newSize) => {
    if (!selectedElementId || isNaN(newSize) || newSize <= 0) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, fontSize: parseFloat(newSize) } }
          : n
      )
    );
  };

  /**
   * Updates the X offset of the text within the selected node.
   */
  const updateNodeTextOffsetX = (newOffsetX) => {
    if (!selectedElementId || isNaN(newOffsetX)) return; // Allow 0 and negative values
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, textOffsetX: parseFloat(newOffsetX) } }
          : n
      )
    );
  };

  /**
   * Updates the Y offset of the text within the selected node.
   */
  const updateNodeTextOffsetY = (newOffsetY) => {
    if (!selectedElementId || isNaN(newOffsetY)) return; // Allow 0 and negative values
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId
          ? { ...n, data: { ...n.data, textOffsetY: parseFloat(newOffsetY) } }
          : n
      )
    );
  };

  /**
   * Updates the rotation of the selected arrow node.
   */
  const updateArrowRotation = (newRotation) => {
    if (!selectedElementId || isNaN(newRotation)) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId && n.type === 'arrow'
          ? { ...n, data: { ...n.data, rotation: parseFloat(newRotation) } }
          : n
      )
    );
  };

  /**
   * Updates the arrowhead style of the selected arrow node.
   */
  const updateArrowheadStyle = (newStyle) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId && n.type === 'arrow'
          ? { ...n, data: { ...n.data, arrowheadStyle: newStyle } }
          : n
      )
    );
  };

  /**
   * Updates the arrowhead color of the selected arrow node.
   */
  const updateArrowheadColor = (newColor) => {
    if (!selectedElementId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedElementId && n.type === 'arrow'
          ? { ...n, data: { ...n.data, arrowheadColor: newColor } }
          : n
      )
    );
  };

  /**
   * Updates the label of the selected edge.
   */
  const updateEdgeLabel = (newLabel) => {
    if (!selectedElementId) return;
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedElementId ? { ...e, label: newLabel } : e
      )
    );
  };

  /**
   * Updates the marker end type of the selected edge.
   */
  const updateEdgeMarkerEndType = (newMarkerType) => {
    if (!selectedElementId) return;
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedElementId
          ? {
              ...e,
              markerEnd: {
                ...e.markerEnd,
                type: newMarkerType === 'None' ? null : MarkerType[newMarkerType], // Use MarkerType enum
              },
            }
          : e
      )
    );
  };

  /**
   * Updates the marker end color of the selected edge.
   */
  const updateEdgeMarkerEndColor = (newColor) => {
    if (!selectedElementId) return;
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedElementId
          ? {
              ...e,
              markerEnd: {
                ...e.markerEnd,
                color: newColor,
              },
            }
          : e
      )
    );
  };

  /**
   * Changes the z-index (layering) of the selected node.
   */
  const changeNodeLayer = (direction) => {
    if (!selectedElementId || !selectedNode) return;

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      const selectedNodeIndex = updatedNodes.findIndex(n => n.id === selectedElementId);

      if (selectedNodeIndex === -1) return prevNodes;

      const nodeToMove = updatedNodes[selectedNodeIndex];
      let newZIndex = nodeToMove.zIndex || 10;

      if (direction === 'front') {
        newZIndex = Math.max(...updatedNodes.map(n => n.zIndex || 10)) + 1;
      } else if (direction === 'back') {
        newZIndex = Math.min(...updatedNodes.map(n => n.zIndex || 10)) - 1;
      }

      updatedNodes[selectedNodeIndex] = { ...nodeToMove, zIndex: newZIndex };
      return updatedNodes;
    });
  };

  /**
   * Clears all nodes and edges from the diagram.
   */
  const clearDiagram = () => {
    setNodes([]);
    setEdges([]);
    setSelectedElementId(null);
    setError(null);
  };

  /**
   * Triggers the layout function in the DiagramCanvas component.
   */
  const triggerApplyLayout = () => {
    if (diagramCanvasRef.current && typeof diagramCanvasRef.current.applyLayout === 'function') {
      diagramCanvasRef.current.applyLayout();
    } else {
        alert('Layout function not ready yet. Please ensure the diagram has loaded.');
    }
  };

  /**
   * Handles adding new nodes and connecting them with an edge.
   */
  const handleAddNewNodesWithEdge = () => {
    const id1 = generateId();
    const id2 = generateId();
    const newNodes = [
      {
        id: id1,
        position: { x: 50, y: 50 },
        data: { label: 'Node 1', color: '#a7f3d0', textColor: 'var(--color-node-text)', fontWeight: 'normal', nodeWidth: 150, nodeHeight: 80, fontSize: 14, textOffsetX: 0, textOffsetY: 0 },
        type: 'rectangle',
        zIndex: 10,
      },
      {
        id: id2,
        position: { x: 300, y: 50 },
        data: { label: 'Node 2', color: '#bfdbfe', textColor: 'var(--color-node-text)', fontWeight: 'normal', nodeWidth: 150, nodeHeight: 80, fontSize: 14, textOffsetX: 0, textOffsetY: 0 },
        type: 'rectangle',
        zIndex: 10,
      },
    ];
    const newEdge = {
      id: generateId(),
      source: id1,
      target: id2,
      animated: true,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--color-border)',
      },
    };
    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, newEdge]);
    setSelectedElementId(newEdge.id); // Select the newly created edge
  };


  /**
   * Handles general "Add Edge" guidance.
   */
  const handleAddEdge = () => {
    alert('To add an edge between existing nodes, drag a connection line from a blue handle on one node to a blue handle on another node.');
  };

  /**
   * Triggers PNG download via the DiagramCanvas component.
   */
  const triggerDownloadPng = () => {
    if (diagramCanvasRef.current && typeof diagramCanvasRef.current.toPng === 'function') {
      diagramCanvasRef.current.toPng() // Now calling toPng (from html-to-image) via the instance
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', `${canvasTitle || 'diagram'}.png`);
          a.setAttribute('href', dataUrl);
          a.click();
        })
        .catch((err) => {
          alert('Failed to download PNG. Please try again.');
          console.error('Failed to download PNG:', err);
        });
    } else {
      alert('PNG download function not available yet. Please try again after the diagram loads.');
    }
  };

  /**
   * Triggers JPG download via the DiagramCanvas component.
   */
  const triggerDownloadJpg = () => {
    // JPG download is not directly supported by html-to-image's toPng, or React Flow.
    // It would require client-sided conversion (e.g., drawing the PNG to a canvas and then converting to JPG)
    // or server-side processing.
    alert('JPG download is not directly supported. Please download as PNG and convert it using an external tool if needed.');
  };


  /**
   * Generates a diagram using the Gemini LLM.
   */
  const generateDiagram = async () => {
    setIsLoading(true);
    setError(null);
    clearDiagram();

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: `Generate a ${diagramType} diagram based on the following description. Provide the output as a JSON object with two arrays: 'nodes' and 'edges'. Ensure that node positions (x, y) are diverse and well-distributed within a 50-700 range for clear visibility and no overlap on a typical canvas. Each node must have an 'id' (string, unique), 'position' (object with 'x', 'y' numbers), 'data' (object with 'label' string, 'color' string like a hex code or CSS color name, and optionally 'borderColor' for a border, 'textColor' string for text color, 'fontWeight' string for text boldness (e.g., 'normal', 'bold', 'bolder'), 'nodeWidth' number, 'nodeHeight' number, 'fontSize' number, 'textOffsetX' number, 'textOffsetY' number), and a 'type' (string, one of 'rectangle', 'circle', 'diamond', 'arrow'). For 'arrow' type nodes, also include 'rotation' (number, degrees) and 'arrowheadStyle' (string, 'Closed', 'Open', or 'None'), and 'arrowheadColor' (string, hex color). Also include a 'zIndex' (number, default 10) for layering. Each edge must have an 'id' (string, unique), 'source' (string, ID of source node), 'target' (string, ID of target node), 'animated' (boolean, true), 'label' (string, optional, for text on the edge), and 'markerEnd' (object with type 'arrowclosed' or 'arrow' and color '#333' for a standard arrowhead). Ensure all generated IDs are unique and reference existing nodes for edges.
User description: ${promptText}` }] });

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              nodes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    position: {
                      type: "OBJECT",
                      properties: { x: { type: "NUMBER", minimum: 50, maximum: 700 }, y: { type: "NUMBER", minimum: 50, maximum: 700 } },
                      required: ["x", "y"],
                    },
                    data: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        color: { type: "STRING" },
                        borderColor: { type: "STRING", nullable: true },
                        textColor: { type: "STRING", default: "black" },
                        fontWeight: { type: "STRING", enum: ["normal", "bold", "bolder"], default: "normal" },
                        nodeWidth: { type: "NUMBER", default: 150 },
                        nodeHeight: { type: "NUMBER", default: 80 },
                        fontSize: { type: "NUMBER", default: 14 },
                        textOffsetX: { type: "NUMBER", default: 0 },
                        textOffsetY: { type: "NUMBER", default: 0 },
                        rotation: { type: "NUMBER", default: 0 }, // Added rotation
                        arrowheadStyle: { type: "STRING", enum: ["Closed", "Open", "None"], default: "Closed" }, // Added arrowheadStyle
                        arrowheadColor: { type: "STRING", default: "#333" }, // Added arrowheadColor
                      },
                      required: ["label", "color"],
                    },
                    type: { type: "STRING", enum: ["rectangle", "circle", "diamond", "arrow"], default: "rectangle" }, // Added 'arrow'
                    zIndex: { type: "NUMBER", default: 10 }
                  },
                  required: ["id", "position", "data", "type"],
                },
              },
              edges: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    source: { type: "STRING" },
                    target: { type: "STRING" },
                    animated: { type: "BOOLEAN" },
                    label: { type: "STRING", nullable: true },
                    markerEnd: {
                      type: "OBJECT",
                      properties: {
                        type: { type: "STRING", enum: ["arrowclosed", "arrow"] }, // Allow 'arrowclosed' or 'arrow' for edges
                        color: { type: "STRING" },
                      },
                      required: ["type", "color"],
                    },
                  },
                  required: ["id", "source", "target", "animated"],
                },
              },
            },
            required: ["nodes", "edges"],
          },
        }
      };

      const apiKey = "AIzaSyC2WPBhqi6exRKd0eKVtYISE0ZiK2uqk94";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(jsonString);

        if (parsedData.nodes && Array.isArray(parsedData.nodes) &&
            parsedData.edges && Array.isArray(parsedData.edges)) {
          const newNodes = parsedData.nodes.map(node => ({
            ...node,
            selected: false,
            data: {
              ...node.data,
              textColor: node.data.textColor || 'var(--color-node-text)', // Default text color
              fontWeight: node.data.fontWeight || 'normal',
              nodeWidth: node.data.nodeWidth || (node.type === 'rectangle' ? 150 : (node.type === 'circle' ? 100 : (node.type === 'diamond' ? 120 : 150))),
              nodeHeight: node.data.nodeHeight || (node.type === 'rectangle' ? 80 : (node.type === 'circle' ? 100 : (node.type === 'diamond' ? 120 : 50))),
              fontSize: node.data.fontSize || 14,
              textOffsetX: node.data.textOffsetX || 0,
              textOffsetY: node.data.textOffsetY || 0,
              // Ensure arrow-specific properties have defaults if AI doesn't provide them
              rotation: node.data.rotation || 0,
              arrowheadStyle: node.data.arrowheadStyle || 'Closed',
              arrowheadColor: node.data.arrowheadColor || 'var(--color-border)',
            },
            zIndex: node.zIndex || 10,
          }));
          setNodes(newNodes);
          setEdges(parsedData.edges);
          // Now that nodes/edges are set, trigger fitView via the ref
          if (diagramCanvasRef.current && typeof diagramCanvasRef.current.fitView === 'function') {
            diagramCanvasRef.current.fitView();
          }
        } else {
          setError('Invalid diagram structure received from AI. Please try a different prompt.');
        }
      } else {
        setError('No valid response from AI. Please try again.');
      }
    } catch (err) {
      console.error("Error generating diagram:", err);
      setError(`Failed to generate diagram: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans antialiased theme-bg-gradient text-primary-color">
      {/* Removed Top Header Section */}

      {/* Floating Action Bar */}
      <div className="fixed top-7 left-3/4 -translate-x-1/2 z-50 flex space-x-2 p-2 rounded-full bg-black/50 shadow-lg backdrop-blur-sm">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={historyPointer <= 0}
          className={`p-2 rounded-full text-white transition duration-150 ease-in-out
            ${historyPointer <= 0 ? 'bg-white/20 cursor-not-allowed' : 'bg-white/30 hover:bg-white/40'}`}
          title="Undo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>
        </button>
        {/* Redo Button */}
        <button
          onClick={handleRedo}
          disabled={historyPointer >= history.length - 1}
          className={`p-2 rounded-full text-white transition duration-150 ease-in-out
            ${historyPointer >= history.length - 1 ? 'bg-white/20 cursor-not-allowed' : 'bg-white/30 hover:bg-white/40'}`}
          title="Redo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H6m10 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
        {/* Download PNG Button */}
        <button
          onClick={triggerDownloadPng}
          className="p-2 rounded-full text-white bg-white/30 hover:bg-white/40 shadow-md transition duration-150 ease-in-out"
          title="Download as PNG"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </button>
        {/* Download JPG Button */}
        <button
          onClick={triggerDownloadJpg}
          className="p-2 rounded-full text-white bg-white/30 hover:bg-white/40 shadow-md transition duration-150 ease-in-out"
          title="Download as JPG (approx.)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </button>
      </div>

      {/* Main content area: Left Sidebar + Canvas + Right Sidebar */}
      <div className="flex flex-grow overflow-hidden ">
        {/* Left Sidebar (Icon Toolbar + Elements Panel) */}
        <div className={`flex transition-all duration-300 ease-in-out s ${showLeftPanel ? 'w-[300px]' : 'w-4'}`}>
          {/* Icon Toolbar (simplified) */}
         

          {/* Elements Panel (only Shapes content remains) */}
          <div className={`panel-bg shadow-lg pl-5 p-4 flex flex-col overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out ${showLeftPanel ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="relative mb-4">
               <button
        onClick={() => navigate('/tutorial')}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300"
      >
        Help & Tutorial
      </button>
               
            </div>

            {/* Only 'shapes' content is rendered */}
            {activeLeftPanelTab === 'shapes' && (
                <>
                    <h3 className="font-bold text-lg mb-3 text-primary-color">AI Diagram Generation</h3>
                    <div className="flex flex-col gap-3 mb-4">
                        <label htmlFor="diagramType" className="block text-sm font-medium text-secondary-color">Select Diagram Type:</label>
                        <select
                            id="diagramType"
                            className="w-full p-2 border input-border rounded-md input-focus-ring input-bg text-black"
                            value={diagramType}
                            onChange={(e) => setDiagramType(e.target.value)}
                        >
                            <option value="Flow Chart">Flow Chart</option>
                            <option value="Block Diagram">Block Diagram</option>
                            <option value="UML Diagram">UML Diagram</option>
                            <option value="Decision Tree">Decision Tree</option>
                            <option value="Mind Map">Mind Map</option>
                            <option value="Concept Map">Concept Map</option>
                        </select>
                        <textarea
                            className="flex-grow p-3 border input-border rounded-md input-focus-ring resize-y min-h-[80px] mt-2 input-bg text-black"
                            placeholder={`Describe your ${diagramType} here... e.g., "A ${diagramType.toLowerCase()} for an online order process with steps for payment, shipping, and confirmation. Include a decision point for payment success."`}
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            rows={4}
                        ></textarea>
                        <button
                            onClick={generateDiagram}
                            disabled={isLoading || !promptText.trim()}
                            className={`px-4 py-2 rounded-md font-semibold btn-primary-text transition-all duration-200 ease-in-out
                                ${isLoading ? 'bg-[var(--gradient-button-primary-hover-from)] cursor-not-allowed' : 'btn-primary-gradient shadow-md'}`}
                        >
                            {isLoading ? 'Generating...' : 'Generate Diagram'}
                        </button>
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-primary-color">Add Shapes Manually</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <button
                        onClick={() => addShape('rectangle')}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <div className="w-12 h-8 bg-blue-100 border border-blue-300 rounded-md mb-1"></div> Rectangle
                      </button>
                      <button
                        onClick={() => addShape('circle')}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <div className="w-10 h-10 bg-green-100 border border-green-300 rounded-full mb-1"></div> Circle
                      </button>
                      <button
                        onClick={() => addShape('diamond')}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <div className="w-10 h-10 bg-purple-100 border border-purple-300 rotate-45 mb-1"></div> Diamond
                      </button>
                       <button
                        onClick={() => addShape('arrow')}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <svg className="w-12 h-8 icon-color transform rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> Arrow
                      </button>
                       <button
                        onClick={handleAddNewNodesWithEdge}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <svg className="w-10 h-8 icon-color" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> Add Connection (New Nodes)
                      </button>
                       <button
                        onClick={handleAddEdge}
                        className="flex flex-col items-center p-3 border panel-border rounded-lg bg-[var(--color-card-bg)] hover:bg-[var(--color-button-secondary-hover-bg)] transition duration-150 ease-in-out text-sm card-text"
                      >
                        <svg className="w-10 h-8 icon-color" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> Edge (Connect Existing)
                      </button>
                    </div>

                    <h3 className="font-bold text-lg mb-3 text-primary-color">Layout Options</h3>
                    <div className="flex flex-col gap-3 mb-6">
                      <button
                        onClick={triggerApplyLayout}
                        className="px-4 py-2 btn-primary-gradient btn-primary-text rounded-md shadow-md transition duration-150 ease-in-out"
                      >
                        Apply Tree Layout (Conceptual)
                      </button>
                    </div>


                    <h3 className="font-bold text-lg mb-3 text-primary-color">Diagram Categories</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['Cycles', 'Flow Chart', 'Relationships', 'Graphs', 'UML', 'Block Diagram'].map(category => (
                            <span
                                key={category}
                                className="px-4 py-2 suggestion-tag-bg suggestion-tag-text rounded-full text-sm opacity-75"
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={clearDiagram}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm transition duration-150 ease-in-out mt-auto"
                    >
                        Clear All
                    </button>
                </>
            )}

            {/* Removed Text, Music, Video, More tab content */}
          </div>
        </div>

        {/* Diagram Canvas Area (ReactFlow) */}
        {/* ReactFlowProvider must wrap any component that uses React Flow hooks (like useReactFlow) */}
        <ReactFlowProvider>
            <DiagramCanvas
                nodes={nodes}
                setNodes={setNodes} // Pass setNodes down
                onNodesChange={customOnNodesChange} // Use custom handler
                edges={edges}
                setEdges={setEdges} // Pass setEdges down
                onEdgesChange={customOnEdgesChange} // Use custom handler
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onElementContextMenu={onElementContextMenu}
                nodeTypes={nodeTypes} // Pass the globally defined nodeTypes
                canvasTitle={canvasTitle}
                error={error}
                ref={diagramCanvasRef}
            />
        </ReactFlowProvider>


        {/* Right Sidebar (Properties Panel) */}
        <div className={`panel-bg shadow-lg p-4 flex flex-col flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out ${showRightPanel ? 'w-80' : 'w-0 opacity-0'}`}>
          <h3 className="text-xl font-bold mb-4 text-primary-color">Properties</h3>

          {nodes.length > 0 ? (
            selectedNode && !selectedEdge ? (
              <div className="mb-6 pb-4 border-b panel-border">
                <h4 className="font-semibold text-lg mb-3 text-secondary-color">Selected Node</h4>
                <div className="mb-3">
                  <label htmlFor="nodeLabel" className="block text-sm font-medium text-secondary-color mb-1">Label:</label>
                  <input
                    type="text"
                    id="nodeLabel"
                    className="w-full p-2 border input-border rounded-md input-focus-ring input-bg input-text-color"
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeLabel(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nodeColor" className="block text-sm font-medium text-secondary-color mb-1">Background Color:</label>
                  <input
                    type="color"
                    id="nodeColor"
                    className="w-full p-2 border input-border rounded-md h-10"
                    value={colorNameToHex(selectedNode.data.color)} // Ensure hex format
                    onChange={(e) => updateNodeColor(e.target.value)}
                  />
                </div>
                {/* Text Color Option */}
                {selectedNode.type !== 'arrow' && ( // Hide for arrow type
                  <div className="mb-3">
                    <label htmlFor="nodeTextColor" className="block text-sm font-medium text-secondary-color mb-1">Text Color:</label>
                    <input
                      type="color"
                      id="nodeTextColor"
                      className="w-full p-2 border input-border rounded-md h-10"
                      value={colorNameToHex(selectedNode.data.textColor || 'var(--color-node-text)')} // Use existing value or default to black, ensure hex
                      onChange={(e) => updateNodeTextColor(e.target.value)}
                    />
                  </div>
                )}
                {/* Font Weight Option */}
                {selectedNode.type !== 'arrow' && ( // Hide for arrow type
                  <div className="mb-3">
                    <label htmlFor="nodeFontWeight" className="block text-sm font-medium text-secondary-color mb-1">Font Weight:</label>
                    <select
                      id="nodeFontWeight"
                      className="w-full p-2 border input-border rounded-md input-focus-ring input-bg input-text-color"
                      value={selectedNode.data.fontWeight || 'normal'} // Use existing value or default to normal
                      onChange={(e) => updateNodeFontWeight(e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="bolder">Bolder</option>
                    </select>
                  </div>
                )}

                {/* Node Width Option */}
                <div className="mb-3">
                  <label htmlFor="nodeWidth" className="block text-sm font-medium text-secondary-color mb-1">Width (px):</label>
                  <input
                    type="range" // Changed to range input
                    id="nodeWidth"
                    className="w-full"
                    min="50"
                    max="400"
                    value={selectedNode.data.nodeWidth || 150}
                    onChange={(e) => updateNodeWidth(e.target.value)}
                  />
                  <span className="text-secondary-color text-sm">{selectedNode.data.nodeWidth || 150}px</span>
                </div>

                {/* Node Height Option */}
                <div className="mb-3">
                  <label htmlFor="nodeHeight" className="block text-sm font-medium text-secondary-color mb-1">Height (px):</label>
                  <input
                    type="range" // Changed to range input
                    id="nodeHeight"
                    className="w-full"
                    min="50"
                    max="400"
                    value={selectedNode.data.nodeHeight || 80}
                    onChange={(e) => updateNodeHeight(e.target.value)}
                  />
                  <span className="text-secondary-color text-sm">{selectedNode.data.nodeHeight || 80}px</span>
                </div>

                {/* Font Size Option */}
                {selectedNode.type !== 'arrow' && ( // Hide for arrow type
                  <div className="mb-3">
                    <label htmlFor="fontSize" className="block text-sm font-medium text-secondary-color mb-1">Font Size (px):</label>
                    <input
                      type="range" // Changed to range input
                      id="fontSize"
                      className="w-full"
                      min="8" // Min font size
                      max="48" // Max font size
                      value={selectedNode.data.fontSize || 14}
                      onChange={(e) => updateNodeFontSize(e.target.value)}
                    />
                    <span className="text-secondary-color text-sm">{selectedNode.data.fontSize || 14}px</span>
                  </div>
                )}

                {/* Text Offset X Option */}
                {selectedNode.type !== 'arrow' && ( // Hide for arrow type
                  <div className="mb-3">
                    <label htmlFor="textOffsetX" className="block text-sm font-medium text-secondary-color mb-1">Text X Offset (px):</label>
                    <input
                      type="range" // Changed to range input
                      id="textOffsetX"
                      className="w-full"
                      min="-50" // Min offset
                      max="50" // Max offset
                      value={selectedNode.data.textOffsetX || 0}
                      onChange={(e) => updateNodeTextOffsetX(e.target.value)}
                    />
                    <span className="text-secondary-color text-sm">{selectedNode.data.textOffsetX || 0}px</span>
                  </div>
                )}

                {/* Text Offset Y Option */}
                {selectedNode.type !== 'arrow' && ( // Hide for arrow type
                  <div className="mb-3">
                    <label htmlFor="textOffsetY" className="block text-sm font-medium text-secondary-color mb-1">Text Y Offset (px):</label>
                    <input
                      type="range" // Changed to range input
                      id="textOffsetY"
                      className="w-full"
                      min="-50" // Min offset
                      max="50" // Max offset
                      value={selectedNode.data.textOffsetY || 0}
                      onChange={(e) => updateNodeTextOffsetY(e.target.value)}
                    />
                    <span className="text-secondary-color text-sm">{selectedNode.data.textOffsetY || 0}px</span>
                  </div>
                )}

                {/* Arrow specific options (only visible if selectedNode.type === 'arrow') */}
                {selectedNode.type === 'arrow' && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="arrowRotation" className="block text-sm font-medium text-secondary-color mb-1">Rotation (deg):</label>
                      <input
                        type="range" // Use range input for smoother rotation
                        id="arrowRotation"
                        className="w-full"
                        min="0"
                        max="360"
                        value={selectedNode.data.rotation || 0}
                        onChange={(e) => updateArrowRotation(e.target.value)}
                      />
                      <span className="text-secondary-color text-sm">{selectedNode.data.rotation || 0}°</span>
                    </div>
                     {/* For arrow, width and height controls are specific for arrow line/head size, not bounding box */}
                    {/* The existing nodeWidth/nodeHeight inputs already handle the visual size of the arrow SVG within the node */}
                    {/* Re-using nodeWidth and nodeHeight for arrow's visual length/thickness. Min/Max values are adjusted for arrow. */}
                    <div className="mb-3">
                      <label htmlFor="arrowWidth" className="block text-sm font-medium text-secondary-color mb-1">Arrow Length (px):</label>
                      <input
                        type="range" // Use range input for width
                        id="arrowWidth"
                        className="w-full"
                        min="50"
                        max="300"
                        value={selectedNode.data.nodeWidth || 150}
                        onChange={(e) => updateNodeWidth(e.target.value)}
                      />
                      <span className="text-secondary-color text-sm">{selectedNode.data.nodeWidth || 150}px</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="arrowHeight" className="block text-sm font-medium text-secondary-color mb-1">Arrow Thickness (px):</label>
                      <input
                        type="range" // Use range input for height
                        id="arrowHeight"
                        className="w-full"
                        min="10"
                        max="100"
                        value={selectedNode.data.nodeHeight || 50}
                        onChange={(e) => updateNodeHeight(e.target.value)}
                      />
                      <span className="text-secondary-color text-sm">{selectedNode.data.nodeHeight || 50}px</span>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="arrowheadStyle" className="block text-sm font-medium text-secondary-color mb-1">Arrowhead Style:</label>
                      <select
                        id="arrowheadStyle"
                        className="w-full p-2 border input-border rounded-md input-focus-ring input-bg input-text-color"
                        value={selectedNode.data.arrowheadStyle || 'Closed'}
                        onChange={(e) => updateArrowheadStyle(e.target.value)}
                      >
                        <option value="Closed">Closed</option>
                        <option value="Open">Open</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="arrowheadColor" className="block text-sm font-medium text-secondary-color mb-1">Arrowhead Color:</label>
                      <input
                        type="color"
                        id="arrowheadColor"
                        className="w-full p-2 border input-border rounded-md h-10"
                        value={colorNameToHex(selectedNode.data.arrowheadColor || 'var(--color-border)')}
                        onChange={(e) => updateArrowheadColor(e.target.value)}
                      />
                    </div>
                  </>
                )}


                <div className="mb-3">
                  <h5 className="text-sm font-medium text-secondary-color mb-2">Layering:</h5>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeNodeLayer('front')}
                      className="flex-1 px-4 py-2 btn-secondary-bg btn-secondary-text rounded-md btn-secondary-hover-bg btn-secondary-hover-text transition duration-150 ease-in-out"
                    >
                      Bring to Front
                    </button>
                    <button
                      onClick={() => changeNodeLayer('back')}
                      className="flex-1 px-4 py-2 btn-secondary-bg btn-secondary-text rounded-md btn-secondary-hover-bg btn-secondary-hover-text transition duration-150 ease-in-out"
                    >
                      Send to Back
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => deleteSelectedElement()}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm transition duration-150 ease-in-out mt-4"
                >
                  Delete Node
                </button>
              </div>
            ) : selectedEdge ? (
              <div className="mb-6 pb-4 border-b panel-border">
                <h4 className="font-semibold text-lg mb-3 text-secondary-color">Selected Edge</h4>
                <div className="mb-3">
                  <label htmlFor="edgeLabel" className="block text-sm font-medium text-secondary-color mb-1">Label:</label>
                  <input
                    type="text"
                    id="edgeLabel"
                    className="w-full p-2 border input-border rounded-md input-focus-ring input-bg input-text-color"
                    value={selectedEdge.label || ''}
                    onChange={(e) => updateEdgeLabel(e.target.value)}
                  />
                </div>
                {/* Edge Arrowhead Type */}
                <div className="mb-3">
                  <label htmlFor="edgeMarkerEndType" className="block text-sm font-medium text-secondary-color mb-1">Arrowhead Type:</label>
                  <select
                    id="edgeMarkerEndType"
                    className="w-full p-2 border input-border rounded-md input-focus-ring input-bg input-text-color"
                    value={selectedEdge.markerEnd?.type === MarkerType.ArrowClosed ? 'ArrowClosed' : (selectedEdge.markerEnd?.type === MarkerType.Arrow ? 'Arrow' : 'None')}
                    onChange={(e) => updateEdgeMarkerEndType(e.target.value)}
                  >
                    <option value="ArrowClosed">Closed Arrow</option>
                    <option value="Arrow">Open Arrow</option>
                    <option value="None">None</option>
                  </select>
                </div>
                {/* Edge Arrowhead Color */}
                <div className="mb-3">
                  <label htmlFor="edgeMarkerEndColor" className="block text-sm font-medium text-secondary-color mb-1">Arrowhead Color:</label>
                  <input
                    type="color"
                    id="edgeMarkerEndColor"
                    className="w-full p-2 border input-border rounded-md h-10"
                    value={colorNameToHex(selectedEdge.markerEnd?.color || 'var(--color-border)')}
                    onChange={(e) => updateEdgeMarkerEndColor(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => deleteSelectedElement()}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm transition duration-150 ease-in-out mt-4"
                >
                  Delete Edge
                </button>
              </div>
            ) : (
              <p className="text-secondary-color">Select a node or an edge to see its properties.</p>
            )
          ) : (
            <p className="text-secondary-color">Start by adding shapes or generating a diagram!</p>
          )}
        </div>
      </div>

      <Modal {...modalConfig} show={showModal} />

      {/* Panel Toggle Buttons */}
      {/* Left Panel Toggle Button */}
      <button
        onClick={() => setShowLeftPanel(!showLeftPanel)}
        className="absolute top-1/2 -translate-y-1/2 z-40 bg-black/20 text-white p-2 rounded-full shadow-md hover:bg-black/40 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ left: showLeftPanel ? 'calc(352px - 20px)' : 'calc(0px + 20px)' }} /* Adjust to be outside panel */
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showLeftPanel ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}></path>
        </svg>
      </button>

      {/* Right Panel Toggle Button */}
      <button
        onClick={() => setShowRightPanel(!showRightPanel)}
        className="absolute top-1/2 -translate-y-1/2 z-40 bg-black/20 text-white p-2 rounded-full shadow-md hover:bg-black/40 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ right: showRightPanel ? 'calc(288px - 20px)' : 'calc(0px + 20px)' }} /* Adjust to be outside panel */
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showRightPanel ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}></path>
        </svg>
      </button>
    </div>
  );
};

export default Mindmap;