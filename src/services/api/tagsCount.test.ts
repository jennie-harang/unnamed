import {
  deleteDoc,
  getDoc, getDocs, setDoc, updateDoc,
} from 'firebase/firestore';

import { deleteTagCount, getTagsCount, updateTagCount } from './tagsCount';

jest.mock('../firebase');

describe('tagsCount API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTagsCount', () => {
    const tagCount = {
      name: 'test', count: 1,
    };

    beforeEach(() => {
      (getDocs as jest.Mock).mockImplementationOnce(() => ({
        docs: [{
          data: jest.fn().mockReturnValue(tagCount),
        }],
      }));
    });

    it('테그 리스트가 반환되어야만 한다', async () => {
      const response = await getTagsCount();

      expect(response).toEqual([tagCount]);
    });
  });

  describe('updateTagCount', () => {
    const mockResponse = {
      name: 'test',
      count: 1,
    };
    const ref = 'ref';

    context('exists가 true인 경우', () => {
      beforeEach(() => {
        (getDoc as jest.Mock).mockImplementationOnce(() => ({
          exists: jest.fn().mockReturnValueOnce(true),
          data: jest.fn().mockReturnValueOnce(mockResponse),
          ref,
        }));
      });

      it('update가 count는 1 증가와 함께 호출되어야만 한다', async () => {
        await updateTagCount(mockResponse.name);

        expect(updateDoc).toBeCalledWith(ref, {
          count: mockResponse.count + 1,
        });
      });
    });

    context('exists가 false인 경우', () => {
      beforeEach(() => {
        (getDoc as jest.Mock).mockImplementationOnce(() => ({
          exists: jest.fn().mockReturnValueOnce(false),
          data: jest.fn().mockReturnValueOnce(mockResponse),
          ref,
        }));
      });

      it('set가 count는 1과 함께 호출되어야만 한다', async () => {
        await updateTagCount(mockResponse.name);

        expect(setDoc).toBeCalledWith(ref, {
          name: mockResponse.name,
          count: 1,
        });
      });
    });
  });

  describe('deleteTagCount', () => {
    const mockResponse = {
      name: 'test',
      count: 1,
    };
    const ref = 'ref';

    context('exists가 true인 경우', () => {
      context('count가 0이 아닌 경우', () => {
        beforeEach(() => {
          (getDoc as jest.Mock).mockImplementationOnce(() => ({
            exists: jest.fn().mockReturnValueOnce(true),
            data: jest.fn().mockReturnValueOnce(mockResponse),
            ref,
          }));
        });

        it('update가 count는 1 감소와 함께 호출되어야만 한다', async () => {
          await deleteTagCount(mockResponse.name);

          expect(updateDoc).toBeCalledWith(ref, {
            count: mockResponse.count - 1,
          });
        });
      });

      context('count가 0인 경우', () => {
        beforeEach(() => {
          (getDoc as jest.Mock).mockImplementationOnce(() => ({
            exists: jest.fn().mockReturnValueOnce(true),
            data: jest.fn().mockReturnValueOnce({
              ...mockResponse,
              count: 0,
            }),
            ref,
          }));
        });

        it('deleteDoc가 호출되어야만 한다', async () => {
          await deleteTagCount(mockResponse.name);

          expect(deleteDoc).toBeCalledWith(ref);
        });
      });
    });

    context('exists가 false인 경우', () => {
      beforeEach(() => {
        (getDoc as jest.Mock).mockImplementationOnce(() => ({
          exists: jest.fn().mockReturnValueOnce(false),
        }));
      });

      it('deleteDoc나 updateDoc가 호출되지 않아야만 한다', async () => {
        await deleteTagCount(mockResponse.name);

        expect(deleteDoc).not.toBeCalled();
        expect(updateDoc).not.toBeCalled();
      });
    });
  });
});
