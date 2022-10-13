import { KeyboardEvent } from 'react';

import { act, renderHook } from '@testing-library/react-hooks';

import useActionKeyEvent from './useActionKeyEvent';

describe('useActionKeyEvent', () => {
  const callback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const useActionKeyEventHook = () => renderHook(() => useActionKeyEvent(given.code, callback));

  context('key code가 같은 경우', () => {
    const mockEvent = {
      code: 'Enter',
    } as KeyboardEvent;

    context('target 키가 배열인 경우', () => {
      given('code', () => ['Enter', 'NumpadEnter']);

      it('callback 함수가 호출되어야만 한다', () => {
        const { result } = useActionKeyEventHook();

        act(() => result.current(mockEvent));

        expect(callback).toBeCalledTimes(1);
      });
    });

    context('target 키가 문자열인 경우', () => {
      given('code', () => 'Enter');

      it('callback 함수가 호출되어야만 한다', () => {
        const { result } = useActionKeyEventHook();

        act(() => result.current(mockEvent));

        expect(callback).toBeCalledTimes(1);
      });
    });
  });

  context('key code가 다른 경우', () => {
    given('code', () => 'Enter');

    const mockEvent = {
      code: 'Escape',
    } as KeyboardEvent;

    it('callback 함수가 호출되지 않아야만 한다', () => {
      const { result } = useActionKeyEventHook();

      act(() => result.current(mockEvent));

      expect(callback).not.toBeCalled();
    });
  });
});
