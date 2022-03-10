import React, { ReactElement, useCallback, useState } from 'react';

import styled from '@emotion/styled';

import useRemoveGroup from '@/hooks/api/group/useRemoveGroup';
import useRemoveGroupThumbnail from '@/hooks/api/storage/useRemoveGroupThumbnail';
import { Group } from '@/models/group';

import Button from '../common/Button';

import ApplicantsViewModal from './modal/ApplicantsViewModal';
import AskRemoveGroupModal from './modal/AskRemoveGroupModal';

interface Props {
  isCompleted: boolean;
  group: Group;
}

function WriterStatusButtons({ group, isCompleted }: Props): ReactElement {
  const { mutate: removeGroupMutate } = useRemoveGroup();
  const { mutate: removeGroupThumbnailMutate } = useRemoveGroupThumbnail();

  const [isVisibleApplicantsModal, setIsVisibleApplicantsModal] = useState<boolean>(false);
  const [isVisibleAskRemoveGroupModal, setIsVisibleAskRemoveGroupModal] = useState<boolean>(false);

  const handleRemove = useCallback(() => {
    removeGroupMutate(group);

    if (group.thumbnail) {
      removeGroupThumbnailMutate(group.thumbnail);
    }
  }, [group, removeGroupMutate, removeGroupThumbnailMutate]);

  return (
    <WriterButtonWrapper>
      <Button>수정</Button>
      <Button
        type="button"
        onClick={() => setIsVisibleAskRemoveGroupModal(true)}
      >
        삭제
      </Button>
      <AskRemoveGroupModal
        isVisible={isVisibleAskRemoveGroupModal}
        onClose={() => setIsVisibleAskRemoveGroupModal(false)}
        onConfirm={handleRemove}
      />
      {isCompleted ? (
        <>
          <Button
            color="primary"
            onClick={() => setIsVisibleApplicantsModal(true)}
          >
            팀원 보기
          </Button>
          <ApplicantsViewModal
            isVisible={isVisibleApplicantsModal}
            onClose={() => setIsVisibleApplicantsModal(false)}
          />
        </>
      ) : (
        <Button href={`/detail/${group.groupId}/applicants`} color="primary">신청현황 보기</Button>
      )}
    </WriterButtonWrapper>
  );
}

export default WriterStatusButtons;

const WriterButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  
  & button {
    margin-right: 8px;
  }

  &:last-of-type {
    margin-right: 0px;
  }
`;
