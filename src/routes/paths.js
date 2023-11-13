// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/hanq';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  qr: '/qr',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  all: path(ROOTS_DASHBOARD, '/all'),
  list: path(ROOTS_DASHBOARD, '/list'),
  user: path(ROOTS_DASHBOARD, '/user'),
  host: {
    root: path(ROOTS_DASHBOARD, '/host'),
    list: path(ROOTS_DASHBOARD, '/host/list'),
    new: path(ROOTS_DASHBOARD, '/host/new'),
    request: path(ROOTS_DASHBOARD, '/host/request'),
  },
};
