import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Input, List } from 'antd';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse';

const { Search } = Input;

type SearchProps = {
  markers: MarkerProps[];
  selected: MarkerProps[];
  searchPlaces: (keyword: string) => void;
  setInfo: (marker: MarkerProps | null) => void;
  addLocation: (marker: MarkerProps) => void;
  removeLocation: (marker: MarkerProps) => void;
  handleDrag: (result: DropResult) => void;
  preview: boolean;
};

export default function SearchBar({
  markers,
  selected,
  searchPlaces,
  setInfo,
  addLocation,
  removeLocation,
  handleDrag,
  preview,
}: SearchProps) {
  const [keyword, setKeyword] = useState('');

  const valueChecker = () => {
    if (keyword === '') {
      return true;
    }
  };

  const submitKeyword = () => {
    if (valueChecker()) {
      alert('검색어를 입력해주세요.');
    }
    searchPlaces(keyword);
  };

  const grid = 5;

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    listStyle: 'none',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'lightgray',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: grid,
  });

  return (
    <div
      className="SearchBar"
      style={{
        width: '390px',
        height: '100vh',
        zIndex: 1,
        backgroundColor: 'white',
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
      }}
    >
      <h1>Search!</h1>
      {/* Keyword Input */}
      <div>
        <Search
          size="large"
          placeholder="검색어를 입력해주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={submitKeyword}
          style={{ width: 300 }}
        />
      </div>

      {/* Selected Location List */}
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="selected">
          {(provided, snapshot) => (
            <ul
              className="selected"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {selected.map((marker, index) => (
                <Draggable
                  key={`${marker.content}`}
                  draggableId={marker.content}
                  index={index}
                  isDragDisabled={preview}
                >
                  {(item, snapshots) => (
                    <li
                      ref={item.innerRef}
                      {...item.dragHandleProps}
                      {...item.draggableProps}
                      style={getItemStyle(snapshots.isDragging, item.draggableProps.style)}
                    >
                      {marker.content}{' '}
                      <IconButton
                        aria-label="delete"
                        disabled={preview}
                        onClick={() => removeLocation(marker)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Search Result List */}
      <div className="rst_wrap">
        <div
          className="rst mCustomScrollbar"
          style={{ position: 'relative', overflow: 'auto', height: '80vh' }}
        >
          <h2>Route</h2>
          <div className="title">
            <strong>Search</strong> Results
          </div>
          <List
            itemLayout="horizontal"
            dataSource={markers}
            renderItem={(item) => (
              <List.Item
                onMouseEnter={() => setInfo(item)}
                onMouseLeave={() => setInfo(null)}
                onClick={() => addLocation(item)}
              >
                {item.content}
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}
