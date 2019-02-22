import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core//styles'
// For future reference
// import { Link } from 'react-router-dom'
// import classNames from 'classnames'
// import BorderVertical from '@@material-ui/core//icons/BorderVertical'
// import Search from '@@material-ui/core//icons/Search'
// import Button from '@material-ui/core//Button'
import CreateEvent from './CreateEvent'
import orange from '@material-ui/core//colors/orange'

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  raisedAccent: {
    backgroundColor: orange[700]
  },
  flex: {
    flex: 1
  }
})

function IconLabelButtons (props) {
  const { classes } = props
  return (
    <div className={classes.flex}>
      <CreateEvent />
      {/* <Button className={classNames(classes.button, classes.raisedAccent)} raised color='accent' component={Link} to='/invitation'>
        <BorderVertical className={classes.leftIcon} />
        Invitation Maker
      </Button> */}
    </div>
  )
}

IconLabelButtons.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(IconLabelButtons)
