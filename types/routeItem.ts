import { ReactNode } from 'react'

// RouteItem 타입 정의
export interface RouteItem {
  path?: string // 경로 (선택적)
  text?: string // 네비게이션 텍스트 (선택적)
  icon?: string // 아이콘 (선택적)
  activeIcon?: string // 활성화된 아이콘 (선택적)
  display?: string // 숨기기 여부를 위한 속성 (선택적)
  children?: RouteItem[] // 하위 경로 (선택적)
  element?: ReactNode // 라우트에 렌더링할 React 컴포넌트 (선택적)
  index?: boolean // 인덱스 라우트 여부 (선택적)
}
