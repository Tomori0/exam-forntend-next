import {
  AppBar, Avatar, BottomNavigation, BottomNavigationAction,
  Box, Divider,
  IconButton, Menu, MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {MouseEvent, useEffect, useState} from "react";
import Link from "next/link";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import QuizIcon from '@mui/icons-material/Quiz';
import ExplicitIcon from '@mui/icons-material/Explicit';
import {useRouter} from "next/router";
import {UserInfo} from "../interface/UserInfo";

export default function Header() {
  const [navValue, setNavValue] = useState<number>(0)
  const [auth, setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>();

  const timer = setTimeout(() => {
    if (sessionStorage.getItem('token') !== null) {
      setAuth(true)
      clearTimeout(timer)
    }
  }, 500)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('user') !== null) {
        const json = JSON.parse(sessionStorage.getItem('user') ?? '');
        setUser(json)
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [auth])

  const handleMenu = (event:  MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    setAuth(false)
    router.push('/')
  }

  const changePage = (navValue: number, path: string) => {
    setNavValue(navValue)
    router.push(path).then(r => console.log(r))
  }

  if (auth) {
    return (
      <Box sx={{ flexGrow: 1, justifyContent: 'center' }}>
        <AppBar position="static">
          <Toolbar>
            <Link href={'/dashboard'} className='flex'>
              <Avatar src='/images/logo.svg' sx={{marginRight: '12px', display: 'inline-block'}}></Avatar>
              <Typography variant="h6" component='div' sx={{height: '40px', lineHeight: '40px'}} className='hidden md:inline-block'>
                玖义考试
              </Typography>
            </Link>
            <div className='flex-1'>
              <BottomNavigation
                showLabels
                value={navValue}
                sx={{backgroundColor: 'primary.main'}}
              >
                <BottomNavigationAction label="首页" icon={<HomeIcon />} onClick={() => changePage(0, '/dashboard')} />
                <BottomNavigationAction label="练习" icon={<QuizIcon />} onClick={() => changePage(1, '/practise')} />
                <BottomNavigationAction label="考试" icon={<ExplicitIcon />} onClick={() => changePage(2, '/examination')} />
              </BottomNavigation>
            </div>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar src={user?.avatar}>{user?.avatar ?? <AccountCircle />}</Avatar>
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
                <MenuItem onClick={handleClose}><PersonIcon/><span className='ml-1'>我的账户</span></MenuItem>
                <MenuItem onClick={handleClose}><PsychologyAltIcon/><span className='ml-1'>AI解惑</span></MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogout}><ExitToAppIcon/><span className='ml-1'>退出登录</span></MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    )
  } else {
    return <></>
  }

}
