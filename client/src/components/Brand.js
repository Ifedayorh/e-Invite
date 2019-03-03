import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import ButtonBase from '@material-ui/core/ButtonBase'

const brandHeight = 64

function theme (outerTheme) {
  return createMuiTheme({
    typography: {
      title: {
        color: '#FFF'
      }
    }
  })
}

const styles = theme => ({
  imageSpace: {
    marginBottom: 5,
    marginRight: 8
  },
  logo: {
    marginLeft: 16,
    minHeight: brandHeight,
    width: '100%',
    justifyContent: 'left',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    }
  }
})

function Brand (props) {
  const { classes } = props
  return (
    <MuiThemeProvider theme={theme}>
      <Toolbar disableGutters>
        <ButtonBase className={classes.logo} disableRipple component={Link} to='/'>
          <img className={classes.imageSpace} src='/static/images/evitehub-icon.png' alt='EviteHub' width='50' />
          <Typography type='title'>EviteHub</Typography>
        </ButtonBase>
      </Toolbar>
    </MuiThemeProvider>
  )
}

Brand.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, theme)(Brand)
