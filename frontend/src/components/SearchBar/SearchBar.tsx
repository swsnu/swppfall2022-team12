import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Input, List, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { MarkerProps } from '../../containers/CourseCreate/SearchCourse';

const { Search } = Input;
const { Text } = Typography;

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
  const homeRef = useRef<HTMLDivElement>(null);

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

  const grid = 3;

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 10px ${grid}px 10px`,
    listStyle: 'none',

    // change background colour if dragging
    background: isDragging ? '#c0d7fa' : 'white',
    border: '2px solid #E5EBF2',
    borderRadius: '10px 10px 10px 10px',

    // styles we need to apply on draggables
    ...draggableStyle,
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
      <h2>장소 찾아보기</h2>
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

      <div
        style={{
          position: 'relative',
          height: '85vh',
          overflow: 'auto',
        }}
      >
        {/* Selected Location List */}
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId="selected">
            {(provided) => (
              <div ref={homeRef}>
                <ul
                  className="selected"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ padding: `${grid}` }}
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
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                            onMouseOver={() => setInfo(marker)}
                            onFocus={() => undefined}
                            onMouseOut={() => setInfo(null)}
                            onBlur={() => undefined}
                          >
                            <Text
                              style={{
                                display: 'inherit',
                                alignItems: 'center',
                                paddingLeft: '10px',
                                fontSize: 15,
                              }}
                            >
                              {marker.content}
                            </Text>
                            <IconButton
                              aria-label="delete"
                              disabled={preview}
                              onClick={() => removeLocation(marker)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Search Result List */}
        <div className="rst_wrap">
          <div className="rst mCustomScrollbar">
            <h3>검색 결과</h3>
            <List
              itemLayout="horizontal"
              dataSource={markers}
              renderItem={(item) => (
                <List.Item
                  onMouseEnter={() => setInfo(item)}
                  onMouseLeave={() => setInfo(null)}
                  onClick={() => {
                    addLocation(item);
                    homeRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.content}
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
