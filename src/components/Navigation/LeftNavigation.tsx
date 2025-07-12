import { Box, Menu, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconChartBar,
  IconClipboardList,
  IconDatabase,
  IconForms,
  IconLayoutDashboard,
  IconMap,
  IconReport,
  IconSearch,
  IconShield,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function LeftNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, setOpened] = useState(false);
  const [formsOpened, setFormsOpened] = useState(false);
  const [requestsOpened, setRequestsOpened] = useState(false);
  const [statisticsOpened, setStatisticsOpened] = useState(false);

  const adminSubMenuItems = [
    { label: 'Dashboard', icon: IconLayoutDashboard, path: '/admin' },
    {
      label: 'Entity Console',
      icon: IconDatabase,
      path: '/admin/entity-console',
    },
    {
      label: 'Access Control',
      icon: IconShield,
      path: '/admin/access-control',
    },
  ];

  const formsSubMenuItems = [
    {
      icon: IconMap,
      subItems: [{ label: 'New Map', path: '/forms/map/create' }],
    },
    {
      icon: IconReport,
      subItems: [{ label: 'New Report', path: '/forms/report/create' }],
    },
    {
      icon: IconWorld,
      subItems: [{ label: 'New Country', path: '/forms/countries/create' }],
    },
  ];

  const requestsSubMenuItems = [
    {
      icon: IconMap,
      subItems: [{ label: 'Map Requests', path: '/requests/map' }],
    },
    {
      icon: IconReport,
      subItems: [{ label: 'Report Requests', path: '/requests/report' }],
    },
    {
      icon: IconWorld,
      subItems: [{ label: 'Country Requests', path: '/requests/country' }],
    },
  ];

  const statisticsSubMenuItems = [
    {
      icon: IconMap,
      subItems: [{ label: 'Person Statistics', path: '/statistics/person' }],
    },
    {
      icon: IconMap,
      subItems: [{ label: 'Map Statistics', path: '/statistics/map' }],
    },
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFormsRoute = location.pathname.startsWith('/forms');
  const isRequestsRoute = location.pathname.startsWith('/requests');
  const isStatisticsRoute = location.pathname.startsWith('/statistics');
  const isMainRoute = location.pathname === '/';

  return (
    <Box
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 64,
        backgroundColor: 'var(--mantine-color-gray-0)',
        borderRight: '1px solid var(--mantine-color-gray-3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 0',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Stack gap="sm" align="center">
          {/* Search/Home Button */}
          <UnstyledButton
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isMainRoute
                ? 'var(--mantine-color-green-1)'
                : 'transparent',
              color: isMainRoute
                ? 'var(--mantine-color-green-7)'
                : 'var(--mantine-color-gray-7)',
              transition: 'all 0.2s ease',
              outline: 'none',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-green-1)',
                color: 'var(--mantine-color-green-7)',
              },
            }}
            onClick={() => navigate('/')}
          >
            <IconSearch size={24} />
          </UnstyledButton>

          {/* Forms Menu */}
          <Menu
            opened={formsOpened}
            onClose={() => setFormsOpened(false)}
            position="right-start"
            offset={8}
            withArrow
            shadow="md"
          >
            <Menu.Target>
              <UnstyledButton
                onMouseEnter={() => setFormsOpened(true)}
                onMouseLeave={() => setFormsOpened(false)}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFormsRoute
                    ? 'var(--mantine-color-green-1)'
                    : 'transparent',
                  color: isFormsRoute
                    ? 'var(--mantine-color-green-7)'
                    : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-green-1)',
                    color: 'var(--mantine-color-green-7)',
                  },
                }}
              >
                <IconForms size={24} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown
              onMouseEnter={() => setFormsOpened(true)}
              onMouseLeave={() => setFormsOpened(false)}
            >
              <Menu.Label>Forms</Menu.Label>
              {formsSubMenuItems.map((category, idx) => (
                <div key={idx}>
                  {category.subItems.map((subItem) => (
                    <Menu.Item
                      key={subItem.path}
                      onClick={() => navigate(subItem.path)}
                      style={{
                        backgroundColor:
                          location.pathname === subItem.path
                            ? 'var(--mantine-color-green-1)'
                            : 'transparent',
                        marginLeft: 0,
                        marginRight: 0,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      {subItem.label}
                    </Menu.Item>
                  ))}
                </div>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* Requests Menu */}
          <Menu
            opened={requestsOpened}
            onClose={() => setRequestsOpened(false)}
            position="right-start"
            offset={8}
            withArrow
            shadow="md"
          >
            <Menu.Target>
              <UnstyledButton
                onMouseEnter={() => setRequestsOpened(true)}
                onMouseLeave={() => setRequestsOpened(false)}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isRequestsRoute
                    ? 'var(--mantine-color-green-1)'
                    : 'transparent',
                  color: isRequestsRoute
                    ? 'var(--mantine-color-green-7)'
                    : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-green-1)',
                    color: 'var(--mantine-color-green-7)',
                  },
                }}
              >
                <IconClipboardList size={24} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown
              onMouseEnter={() => setRequestsOpened(true)}
              onMouseLeave={() => setRequestsOpened(false)}
            >
              <Menu.Label>Requests</Menu.Label>
              {requestsSubMenuItems.map((category, idx) => (
                <div key={idx}>
                  {category.subItems.map((subItem) => (
                    <Menu.Item
                      key={subItem.path}
                      onClick={() => navigate(subItem.path)}
                      style={{
                        backgroundColor:
                          location.pathname === subItem.path
                            ? 'var(--mantine-color-green-1)'
                            : 'transparent',
                        marginLeft: 0,
                        marginRight: 0,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      {subItem.label}
                    </Menu.Item>
                  ))}
                </div>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* Statistics Menu */}
          <Menu
            opened={statisticsOpened}
            onClose={() => setStatisticsOpened(false)}
            position="right-start"
            offset={8}
            withArrow
            shadow="md"
          >
            <Menu.Target>
              <UnstyledButton
                onMouseEnter={() => setStatisticsOpened(true)}
                onMouseLeave={() => setStatisticsOpened(false)}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isStatisticsRoute
                    ? 'var(--mantine-color-green-1)'
                    : 'transparent',
                  color: isStatisticsRoute
                    ? 'var(--mantine-color-green-7)'
                    : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-green-1)',
                    color: 'var(--mantine-color-green-7)',
                  },
                }}
              >
                <IconChartBar size={24} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown
              onMouseEnter={() => setStatisticsOpened(true)}
              onMouseLeave={() => setStatisticsOpened(false)}
            >
              <Menu.Label>Statistics</Menu.Label>
              {statisticsSubMenuItems.map((category, idx) => (
                <div key={idx}>
                  {category.subItems.map((subItem) => (
                    <Menu.Item
                      key={subItem.path}
                      onClick={() => navigate(subItem.path)}
                      style={{
                        backgroundColor:
                          location.pathname === subItem.path
                            ? 'var(--mantine-color-green-1)'
                            : 'transparent',
                        marginLeft: 0,
                        marginRight: 0,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      {subItem.label}
                    </Menu.Item>
                  ))}
                </div>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* Admin Dashboard Menu */}
          <Menu
            opened={opened}
            onClose={() => setOpened(false)}
            position="right-start"
            offset={8}
            withArrow
            shadow="md"
          >
            <Menu.Target>
              <UnstyledButton
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isAdminRoute
                    ? 'var(--mantine-color-green-1)'
                    : 'transparent',
                  color: isAdminRoute
                    ? 'var(--mantine-color-green-7)'
                    : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-green-1)',
                    color: 'var(--mantine-color-green-7)',
                  },
                }}
                onClick={() => navigate('/admin')}
              >
                <IconLayoutDashboard size={24} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            >
              <Menu.Label>Admin Dashboard</Menu.Label>
              {adminSubMenuItems.map((item) => (
                <Menu.Item
                  key={item.path}
                  leftSection={<item.icon size={16} />}
                  onClick={() => navigate(item.path)}
                  style={{
                    backgroundColor:
                      location.pathname === item.path
                        ? 'var(--mantine-color-green-1)'
                        : 'transparent',
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </Box>

      {/* User Profile at Bottom */}
      <Tooltip
        label={
          <div>
            <div>John Doe</div>
            <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
              ID: USR-12345
            </div>
          </div>
        }
        position="right"
        withArrow
      >
        <UnstyledButton
          style={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            color: 'var(--mantine-color-gray-7)',
            transition: 'all 0.2s ease',
            outline: 'none',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-gray-2)',
              color: 'var(--mantine-color-gray-9)',
            },
          }}
        >
          <IconUser size={24} />
        </UnstyledButton>
      </Tooltip>
    </Box>
  );
}
