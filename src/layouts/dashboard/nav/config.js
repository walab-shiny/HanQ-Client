// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  menuItem: icon('ic_menu_item'),
  calendar: icon('ic_calendar'),
  user: icon('ic_user'),
  label: icon('ic_label'),
};

export const navConfigUser = [
  // 일반
  // ----------------------------------------------------------------------
  {
    subheader: '일반',
    items: [
      { title: '공개 이벤트 목록 조회', path: PATH_DASHBOARD.all, icon: ICONS.menuItem },
      { title: '참여 이벤트 목록 조회', path: PATH_DASHBOARD.list, icon: ICONS.calendar },
      { title: '프로필 설정', path: PATH_DASHBOARD.user, icon: ICONS.user },
    ],
  },

  // 관리
  // ----------------------------------------------------------------------
  {
    subheader: '관리',
    items: [
      {
        title: '이벤트 주최 권한 신청',
        path: PATH_DASHBOARD.host.request,
        icon: ICONS.label,
      },
    ],
  },
];

export const navConfigHost = [
  // 일반
  // ----------------------------------------------------------------------
  {
    subheader: '일반',
    items: [
      { title: '공개 이벤트 목록 조회', path: PATH_DASHBOARD.all, icon: ICONS.menuItem },
      { title: '참여 이벤트 목록 조회', path: PATH_DASHBOARD.list, icon: ICONS.calendar },
      { title: '프로필 설정', path: PATH_DASHBOARD.user, icon: ICONS.user },
    ],
  },

  // 관리
  // ----------------------------------------------------------------------
  {
    subheader: '관리',
    items: [
      {
        title: '이벤트 주최 관리',
        path: PATH_DASHBOARD.host.root,
        icon: ICONS.label,
        children: [
          {
            title: '이벤트 목록',
            path: PATH_DASHBOARD.host.list,
          },
          {
            title: '이벤트 등록',
            path: PATH_DASHBOARD.host.new,
          },
        ],
      },
    ],
  },
];
