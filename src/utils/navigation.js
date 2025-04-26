let currentRouteName = '';

export const MainNavigation = {
  setCurrentRouteName: routeName => {
    currentRouteName = routeName;
  },
  getCurrentRouteName: () => {
    return currentRouteName;
  },
};
