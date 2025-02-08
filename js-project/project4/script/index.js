import { User } from './user.js';
import { drawTableRows, registerForm, loginForm } from "./domService.js";


console.log('Initial usersList:', User.usersList);
drawTableRows(User.usersList);