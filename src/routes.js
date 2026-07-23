import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdAttachMoney, MdCreditCard, MdAccountBalance, MdCompareArrows, MdMoneyOff
} from 'react-icons/md';

import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import { FiFileText } from 'react-icons/fi';

// Admin Imports
import MainDashboard from 'views/user/default';
import Deposit from 'views/user/deposit';
import VirtualCard from 'views/user/virtual-card';
import CryptoInvestments from 'views/user/marketplace';
import LoansAndMortgages from 'views/user/loans';
import Profile from 'views/user/profile';
import Withdrawal from 'views/user/withdrawal';
import Transactions from 'views/user/dataTables';
import UserManagement from 'components/adminComponents/UserManagement';
import ForgotPassword from 'views/auth/resetPassword/forgotPassword';
import ResetPassword from 'views/auth/resetPassword/resetPassword';
import VerifyEmail from 'views/auth/verifyEmail/verifyEmail';
import RTL from 'views/user/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUp from 'views/auth/signUp';

const routes = [
  {
    name: 'Dashboard',
    layout: '/user',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Online Deposit',
    layout: '/user',
    path: '/deposit',
    icon: <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />,
    component: <Deposit />,
  },
  {
    name: 'Virtual Card',
    layout: '/user',
    path: '/virtual-card',
    icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
    component: <VirtualCard />,
  },
  {
    name: 'Crypto Investments',
    layout: '/user',
    path: '/crypto-investments',
    icon: (
      <Icon
        as={FaEthereum}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <CryptoInvestments />,
    secondary: true,
  },
  {
    name: 'Loans & Mortgages',
    layout: '/user',
    path: '/loans-and-mortgages',
    icon: <Icon as={BsBank2} width="20px" height="20px" color="inherit" />,
    component: <LoansAndMortgages />,
  },
  {
    name: 'Withdrawal',
    layout: '/user',
    path: '/withdrawal',
    icon: <Icon as={BiMoneyWithdraw} width="20px" height="20px" color="inherit" />,
    component: <Withdrawal />,
  },
  {
    name: 'Transactions',
    layout: '/user',
    icon: <Icon as={FiFileText} width="20px" height="20px" color="inherit" />,
    path: '/transactions',
    component: <Transactions />,
  },
  {
    name: 'Profile',
    layout: '/user',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    showInSidebar: false // 👈 this hides it from the sidebar
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignUp />,
    showInSidebar: false // 👈 this too
  },
  {
    name: 'Verify Email',
    layout: '/auth',
    path: '/verify-email',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <VerifyEmail />,
    showInSidebar: false // 👈 this too
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ForgotPassword />,
    showInSidebar: false // 👈 this too
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/reset-password/:token',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ResetPassword />,
    showInSidebar: false
  },
  {
    name: 'Admin Dashboard',
    layout: '/user',
    path: '/admin-dashboard',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <UserManagement />,
    showInSidebar: false // 👈 this too
  },

];

export default routes;
