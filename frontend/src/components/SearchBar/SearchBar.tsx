import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse';

type SearchProps = {
  markers: MarkerProps[];
  selected: MarkerProps[];
  searchPlaces: (keyword: string) => void;
  setInfo: (marker: MarkerProps | null) => void;
  addLocation: (marker: MarkerProps) => void;
  handleDrag: (result: DropResult) => void;
  preview: boolean;
};

export default function SearchBar({
  markers,
  selected,
  searchPlaces,
  setInfo,
  addLocation,
  handleDrag,
  preview,
}: SearchProps) {
  const [keyword, setKeyword] = useState('');

  const valueChecker = () => {
    if (keyword === '') {
      return true;
    }
  };

  const submitKeyword = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        zIndex: 1,
        backgroundColor: 'white',
      }}
    >
      <h1>Search!</h1>
      {/* Keyword Input */}
      <form onSubmit={submitKeyword}>
        <input
          placeholder="검색어를 입력해주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button>검색</button>
      </form>

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
                      {marker.content}
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
          style={{ position: 'relative', overflow: 'auto', height: '100vh' }}
        >
          <h2>Route</h2>
          {/* <div> */}
          {/*  <input placeholder="출발" /> */}
          {/* </div> */}
          {/* <div> */}
          {/*  <input placeholder="도착" /> */}
          {/* </div> */}
          <div className="title">
            <strong>Search</strong> Results
          </div>
          <ul
            id="searchResult"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              height: '110vh',
            }}
          >
            {markers.map((marker) => (
              <button
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                id={marker.content}
                style={{
                  border: 0,
                  padding: '20px 10px 8px',
                  outline: '1px solid blue',
                  backgroundColor: 'white',
                  width: '100%',
                }}
                onMouseEnter={() => setInfo(marker)}
                onMouseLeave={() => setInfo(null)}
                onClick={() => addLocation(marker)}
              >
                {marker.content}
              </button>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
