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

const navConfig = [
  // 일반
  // ----------------------------------------------------------------------
  {
    subheader: '일반',
    items: [
      { title: '모든 이벤트 목록 조회', path: PATH_DASHBOARD.all, icon: ICONS.menuItem },
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
            title: '이벤트 생성',
            path: PATH_DASHBOARD.host.new,
          },
        ],
      },
    ],
  },
];

export default navConfig;
