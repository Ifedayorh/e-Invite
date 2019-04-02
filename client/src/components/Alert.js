import React from 'react'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar';

const styles = theme => ({
  alerts: {
    top: 80
  }
})

function Alert (props) {
  const { classes } = props
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={props.open}
      onClose={props.onClose}
      autoHideDuration={3000}
      classes={{anchorOriginTopRight: classes.alerts}}
      snackbarcontentprops={{
        'aria-describedby': 'message-id2'
      }}
      message={<span id='message-id'>{props.message}</span>}
  />
  )
}

Alert.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Alert)
