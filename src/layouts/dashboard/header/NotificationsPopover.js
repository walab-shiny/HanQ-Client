import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Stack,
  List,
  Badge,
  Avatar,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// apis
import { getTaggedEventList } from '../../../apis/event.ts';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [openPopover, setOpenPopover] = useState(null);
  const [taggedEventList, setTaggedEventList] = useState([]);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const fetchData = async () => {
    try {
      const response = await getTaggedEventList();
      setTaggedEventList(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={0} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">알림</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              최근에 등록된 당신이 관심 있을 만한 이벤트입니다.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                TAGGED EVENTS
              </ListSubheader>
            }
          >
            {taggedEventList.length ? (
              taggedEventList.slice(0, 5).map((event) => <EventItem key={event.id} event={event} />)
            ) : (
              <ListItemButton
                to={PATH_DASHBOARD.user}
                component={RouterLink}
                sx={{
                  py: 1.5,
                  px: 2.5,
                }}
              >
                <ListItemText
                  primary="프로필 설정에서 관심 태그를 등록하세요."
                  secondary="클릭하면 프로필 설정 페이지로 이동합니다."
                />
              </ListItemButton>
            )}
          </List>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

EventItem.propTypes = {
  event: PropTypes.object,
};

function EventItem({ event }) {
  return (
    <ListItemButton
      to={PATH_DASHBOARD.all}
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
    >
      <ListItemAvatar>
        <Avatar variant="rounded" src={event.image} sx={{ bgcolor: 'background.neutral' }} />
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={<Typography variant="subtitle2">{event.name}</Typography>}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(event.openAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}
