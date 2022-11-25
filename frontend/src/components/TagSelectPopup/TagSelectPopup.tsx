import { CloseRounded } from '@mui/icons-material';
import { Button, Chip, Modal, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../store';
import { selectTag, TagType } from '../../store/slices/tag';

interface TagPopupProp {
  toOpen: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  padding: '20px',
  background: 'white',
  borderRadius: '10px',
};

export default function TagSelectPopup(prop: TagPopupProp) {
  const dispatch = useDispatch<AppDispatch>();
  const tagState = useSelector(selectTag);

  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [open, setOpen] = useState<boolean>(prop.toOpen);

  const onCloseModal = () => {
    setOpen(false);
  };

  const onClickTag = (tag: TagType) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const onDeleteTag = (tag: TagType) => {
    setSelectedTags(selectedTags.filter((tg) => tg.id !== tag.id));
  };

  const onComplete = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={onCloseModal}>
      <div id="tag-select-popup" style={style}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <CloseRounded onClick={onCloseModal} />
        </div>
        <div id="tag-container">
          <p>나의 태그</p>
          <div id="my-tag-list">
            <Stack direction="row" spacing={1}>
              {selectedTags.map((tag) => {
                return <Chip label={tag.content} color="primary" variant="outlined" />;
              })}
            </Stack>
          </div>
          <p>아래 태그들 중 취향에 맞는 태그들을 선택해주세요!</p>
          <div id="tag-list">
            <Stack direction="column" spacing={1}>
              {tagState.tags.map((tag: TagType) => {
                const isSelected = selectedTags.includes(tag);
                return isSelected ? (
                  <Chip
                    label={tag.content}
                    onClick={() => onClickTag(tag)}
                    onDelete={() => onDeleteTag(tag)}
                    variant="outlined"
                  />
                ) : (
                  <Chip label={tag.content} onClick={() => onClickTag(tag)} variant="outlined" />
                );
              })}
            </Stack>
          </div>
        </div>
        <div
          id="button-container"
          style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '15px' }}
        >
          <Button variant="outlined" onClick={onComplete}>
            완료
          </Button>
          <Button variant="outlined" onClick={onCloseModal}>
            건너뛰기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
