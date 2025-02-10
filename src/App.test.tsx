import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// adrop 전역 객체 모킹
const mockRequest = vi.fn();
const mockInitialize = vi.fn();

declare global {
  interface Window {
    adrop: {
      initialize: (key: string) => void;
      request: (unitId: string) => Promise<any>;
    };
  }
}

window.adrop = {
  initialize: mockInitialize,
  request: mockRequest,
};

describe('광고 배너 노출 테스트', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 모의 함수 초기화
    vi.clearAllMocks();
  });

  test('초기 렌더링 시 adrop.initialize가 호출되어야 함', () => {
    render(<App />);
    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(mockInitialize).toHaveBeenCalledWith(expect.any(String));
  });

  test('배너 요청 버튼 클릭 시 광고를 요청하고 표시해야 함', async () => {
    const mockBannerHtml = '<div>Test Banner</div>';
    mockRequest.mockResolvedValueOnce({ ad: mockBannerHtml });

    render(<App />);

    // 배너 요청 버튼 찾기 및 클릭
    const requestButton = screen.getByText('Request Banner');
    fireEvent.click(requestButton);

    // adrop.request가 올바른 unit ID로 호출되었는지 확인
    expect(mockRequest).toHaveBeenCalledWith('PUBLIC_TEST_UNIT_ID_375_80');

    // 배너가 화면에 표시되는지 확인
    await waitFor(() => {
      expect(document.body.innerHTML).toContain(mockBannerHtml);
    });
  });

  test('연속으로 광고 요청 시 최신 광고가 표시되어야 함', async () => {
    const firstBanner = '<div>First Banner</div>';
    const secondBanner = '<div>Second Banner</div>';

    mockRequest
      .mockResolvedValueOnce({ ad: firstBanner })
      .mockResolvedValueOnce({ ad: secondBanner });

    render(<App />);
    const requestButton = screen.getByText('Request Banner');

    // 첫 번째 요청
    fireEvent.click(requestButton);
    await waitFor(() => {
      expect(document.body.innerHTML).toContain(firstBanner);
    });

    // 두 번째 요청
    fireEvent.click(requestButton);
    await waitFor(() => {
      expect(document.body.innerHTML).toContain(secondBanner);
      expect(document.body.innerHTML).not.toContain(firstBanner);
    });
  });
});
