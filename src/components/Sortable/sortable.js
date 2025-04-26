import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableItem = ({id, children}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({
      id: id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    // transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    background: isDragging ? '--var(--lightBackground)' : 'transparent', // Change background when dragging
    boxShadow: isDragging
      ? '0 4px 10px rgba(0, 0, 0, 0.3)' // Add shadow while dragging
      : 'none',
    borderRadius: '8px',
    opacity: isDragging ? 0.9 : 1, // Slightly reduce opacity when dragging
    scale: isDragging ? 1.02 : 1, // Slightly enlarge item during drag
    zIndex: isDragging ? 1000 : 'auto',
    cursor: 'default',
  };

  return (
    <li ref={setNodeRef} {...attributes} style={style}>
      {typeof children === 'function' ? children(listeners) : children}
    </li>
  );
};
export default SortableItem;
