import React from 'react'
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText  from '@material-ui/core/ListItemText'


const DrawerLink = props =>
  <ListItem button component={Link} to={props.to}>
    <ListItemIcon>
      {props.children}
    </ListItemIcon>
    <ListItemText primary={props.label} />
  </ListItem>

export default DrawerLink
