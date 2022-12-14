import { CloseRounded } from '@mui/icons-material';
import { Button, Chip, Modal, Stack } from '@mui/material';
import axios from 'axios';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

import { selectTag, TagType } from '../../store/slices/tag';

interface TagPopupProp {
  toOpen: boolean;
  openHandler: Dispatch<SetStateAction<boolean>>;
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
  const tagState = useSelector(selectTag);

  const existing = JSON.parse(window.sessionStorage.getItem('tags') ?? '[]');

  const [selectedTags, setSelectedTags] = useState<TagType['id'][]>(existing);
  const { toOpen, openHandler } = prop;

  const onCloseModal = () => {
    openHandler(false);
  };

  const onClickTag = (tagId: TagType['id']) => {
    setSelectedTags([...selectedTags, tagId]);
  };

  const onDeleteTag = (tagId: TagType['id']) => {
    setSelectedTags(selectedTags.filter((id: TagType['id']) => id !== tagId));
  };

  const onComplete = async () => {
    await axios
      .put(
        '/api/user/tags/',
        { tags: selectedTags },
        { headers: { Authorization: `Bearer ${window.sessionStorage.getItem('access')}` } },
      )
      .then(() => {
        window.sessionStorage.setItem('tags', JSON.stringify(selectedTags));
        openHandler(false);
      });
  };

  return (
    <Modal open={toOpen} onClose={onCloseModal}>
      <div id="tag-select-popup" style={style}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <CloseRounded onClick={onCloseModal} />
        </div>
        <div id="tag-container">
          <p>๋์ ํ๊ทธ</p>
          <div id="my-tag-list">
            <Stack direction="row" spacing={1}>
              {tagState.tags.map((tag: TagType) => {
                return selectedTags.includes(tag.id) ? (
                  <Chip
                    key={`tag-${tag.id}`}
                    label={tag.content}
                    color="primary"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Stack>
          </div>
          <p>์๋ ํ๊ทธ๋ค ์ค ์ทจํฅ์ ๋ง๋ ํ๊ทธ๋ค์ ์?ํํด์ฃผ์ธ์!</p>
          <div id="tag-list">
            <Stack direction="column" spacing={1}>
              {tagState.tags.map((tag: TagType) => {
                const isSelected = selectedTags.includes(tag.id);
                return isSelected ? (
                  <Chip
                    key={tag.id}
                    label={tag.content}
                    onDelete={() => onDeleteTag(tag.id)}
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    key={tag.id}
                    label={tag.content}
                    onClick={() => onClickTag(tag.id)}
                    variant="outlined"
                  />
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
            ์๋ฃ
          </Button>
          <Button variant="outlined" onClick={onCloseModal}>
            ๊ฑด๋๋ฐ๊ธฐ
          </Button>
        </div>
      </div>
    </Modal>
  );
}
