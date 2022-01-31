import { fireEvent, render, screen } from '@testing-library/react';

import COMMENT_FIXTURE from '../../../fixtures/comment';
import PROFILE_FIXTURE from '../../../fixtures/profile';

import CommentsView from './CommentsView';

describe('CommentsView', () => {
  const handleRemove = jest.fn();

  const renderCommentsView = () => render((
    <CommentsView
      isLoading={given.isLoading}
      user={PROFILE_FIXTURE}
      onRemove={handleRemove}
      comments={[COMMENT_FIXTURE]}
    />
  ));

  context('로딩중인 경우', () => {
    given('isLoading', () => true);

    it('"로딩중..."문구가 나타나야만 한다', () => {
      const { container } = renderCommentsView();

      expect(container).toHaveTextContent('로딩중...');
    });
  });

  context('로딩중이 아닌 경우', () => {
    given('isLoading', () => false);

    describe('댓글 작성자가 삭제하기 버튼을 클릭한다', () => {
      it('클릭 이벤트가 발생해야만 한다', () => {
        renderCommentsView();

        fireEvent.click(screen.getByText('삭제'));
        screen.getAllByText(/삭제하기/).forEach((button) => {
          fireEvent.click(button);
        });

        expect(handleRemove).toBeCalledWith(COMMENT_FIXTURE.commentId);
      });
    });
  });
});
