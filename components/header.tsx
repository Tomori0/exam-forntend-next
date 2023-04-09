import {
  AppBar, Avatar, BottomNavigation, BottomNavigationAction,
  Box,
  IconButton, Menu, MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {MouseEvent, useState} from "react";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import ExplicitIcon from '@mui/icons-material/Explicit';
import {useRouter} from "next/router";

type Props = {
  value: number
}

export default function Header({value} : Props) {
  const [auth] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event:  MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changePage = (path: string) => {
    router.push(path).then(() => true)
  }

  return (
    <Box sx={{ flexGrow: 1, justifyContent: 'center' }}>
      <AppBar position="static">
        <Toolbar>
          {/*<IconButton*/}
          {/*  size="large"*/}
          {/*  edge="start"*/}
          {/*  color="inherit"*/}
          {/*  aria-label="menu"*/}
          {/*  sx={{ mr: 2 }}*/}
          {/*>*/}
          {/*  <MenuIcon />*/}
          {/*</IconButton>*/}
          <Link href={'/dashboard'} className='flex'>
            <Avatar src='/images/logo.svg' sx={{marginRight: '12px', display: 'inline-block'}}></Avatar>
            <Typography variant="h6" component='div' sx={{height: '40px', lineHeight: '40px'}} className='hidden md:inline-block'>
              玖义考试
            </Typography>
          </Link>
          <div className='flex-1'>
            <BottomNavigation
              showLabels
              value={value}
              sx={{backgroundColor: 'primary.main'}}
            >
              <BottomNavigationAction label="首页" icon={<HomeIcon />} onClick={() => changePage('/dashboard')} />
              <BottomNavigationAction label="练习" icon={<QuizIcon />} onClick={() => changePage('/practise')} />
              <BottomNavigationAction label="考试" icon={<ExplicitIcon />} onClick={() => changePage('/examination')} />
            </BottomNavigation>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>我的账户</MenuItem>
              <MenuItem onClick={handleClose}>退出登录</MenuItem>
            </Menu>
          </div>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar><AccountCircle /></Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>我的账户</MenuItem>
                <MenuItem onClick={handleClose}>退出登录</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
