import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import PageHeader from '../../components/PageHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import  ListItem from '@material-ui/core/ListItem'
import  ListItemText  from '@material-ui/core/ListItemText'
import Mail from '@material-ui/icons/Mail'
import Avatar from '@material-ui/core/Avatar'
import teal from '@material-ui/core/colors/teal'
import Grid from '@material-ui/core/Grid'
import compose from 'recompose/compose'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    paddingTop: 80,
    margin: '0 auto',
    marginBottom: 30,
    minHeight: '100vh',
    [theme.breakpoints.up('md')]: {
      width: '80%',
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3
    }
  },
  profileImage: {
    width: '100%'
  },
  iconAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: teal[500]
  }
})

class Profile extends Component {
  render () {
    const { classes, auth } = this.props

    return (
      <div className={classes.root}>
        <PageHeader title='Profile' body='User Profile' />
        <div className='profile-area'>
          <Card>
            <CardContent>
              <Grid container spacing={24}>

                <Grid item xs={12} sm={1}>
                  <img src={auth.profile.picture} alt='profile' className={classes.profileImage} />
                </Grid>

                <Grid item xs={12} sm={11}>
                  <List>
                    <ListItem divider>
                      <ListItemText primary={auth.profile.name} />
                    </ListItem>
                    { (auth.profile.email) &&
                      <ListItem divider>
                        <Avatar className={classes.iconAvatar}>
                          <Mail />
                        </Avatar>
                        <ListItemText primary={auth.profile.email} secondary='Email' />
                      </ListItem>
                    }
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default compose(
  withStyles(styles, {
    name: 'Profile'
  }), connect(mapStateToProps)
)(Profile)
