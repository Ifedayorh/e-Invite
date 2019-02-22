import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card, { CardActions, CardContent } from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Radio, { RadioGroup } from '@material-ui/core/Radio'
import  FormControl  from '@material-ui/core/FormControl'
import  FormControlLabel  from '@material-ui/core/FormControlLabel'
import moment from 'moment'

import Card01 from '../../components/invitationCard/Card01'
import Alert from '../../components/Alert'

import API from '../../utils/Api'

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
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3
    }
  },
  card: {
    maxWidth: 695
  },
  media: {
    height: 200
  },
  container: {
    padding: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    textAlign: 'center'
  },
  group: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: theme.spacing.unit
  }
})

class Rsvp extends React.Component {
  state = {
    titleFontType: 'Arial',
    background: 'url("/static/images/invitation/paper05.jpg")',
    titleFontSize: 35,
    title: 'Title of Event',
    description: 'This is the description of the event which was given by the creator of the event',
    date: 'March 8, 2018',
    time: '3:15 PM',
    location: 'Irvine, CA',
    rsvp: '',
    name: '',
    party: 0,
    value: '',
    open: false,
    error: false
  }

  handleRequestClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ open: false, error: false })
  }

  componentDidMount () {
    let parsedURL = new URL(window.location.href)
    let hash = parsedURL.searchParams.get('token')
    let eventId = parsedURL.searchParams.get('id') || this.props.currentEvent._id
    this.getEventInfo(eventId)
    this.getGuest(hash, eventId)
  }

  getGuest = (hash, eventId) => {
    API.getGuestByHash(hash, eventId)
    .then((res) => {
      this.setState({ guestObject: res.data })
    })
    .catch((err) => {
      throw (err)
    })
  }

  getEventInfo = (id) => {
    API.getEventById(id)
    .then(res => {
      this.setState({
        title: res.data.eventName,
        description: res.data.description,
        date: moment(res.data.date).format('MMMM Do YYYY'),
        time: moment(res.data.time).format('hh:mm A'),
        location: res.data.location
      })
    })
  }

  onSubmit = () => {
    switch (this.state.value) {
      case 'Accept':
        API.updateGuest(this.state.guestObject._id,
          {
            guestName: this.state.name,
            guestParty: this.state.party,
            rsvp: true
          })
        .then(() => {
          this.setState({open: true})
        })
        break
      case 'Reject':
        API.updateGuest(this.state.guestObject._id,
          {
            guestName: this.state.guestName,
            guestParty: this.state.guestParty,
            rsvp: false
          })
        .then(() => {
          this.setState({open: true})
        })
        break
      default:
        this.setState({error: true})
        break
    }
  }

    // handle input changes
  handleInputChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render () {
    const { classes, auth } = this.props

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <Card01
            titleFontType={this.state.titleFontType}
            background={this.state.background}
            titleFontSize={this.state.titleFontSize}
            title={this.state.title}
            date={this.state.date}
            time={this.state.time}
            location={this.state.location} />
          <div className={classes.container}>
            <CardContent>
              <Typography type='headline' component='h2'>
                {this.state.title}
              </Typography>
              <Typography component='p'>
                {this.state.description}
              </Typography>

              <div className={classes.formControl}>
                <FormControl component='fieldset' required>
                  <RadioGroup
                    aria-label='rsvp'
                    name='rsvp'
                    className={classes.group}
                    value={this.state.value}
                    onChange={this.handleChange} >
                    <FormControlLabel value='Accept' control={<Radio />} label='ACCEPT' />
                  </RadioGroup>
                </FormControl>
                <FormControl component='fieldset' required>
                  <RadioGroup
                    aria-label='rsvp'
                    name='rsvp'
                    className={classes.group}
                    value={this.state.value}
                    onChange={this.handleChange} >
                    <FormControlLabel value='Reject' control={<Radio />} label='REJECT' />
                  </RadioGroup>
                </FormControl>
              </div>

              <Grid container spacing={24}>
                <Grid item xs={12} md={6}>
                  <TextField
                    autoFocus
                    margin='dense'
                    name='name'
                    label='Guest Name'
                    fullWidth
                    onChange={this.handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin='dense'
                    type='number'
                    name='party'
                    inputProps={{min: 0}}
                    label='No. of Party'
                    fullWidth
                    onChange={this.handleInputChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              {auth.isAuthenticated
              ? <Button raised color='primary' disabled className={classes.button} onClick={this.onSubmit}>
              Submit
              </Button>
              : <Button raised color='primary' className={classes.button} onClick={this.onSubmit}>
              Submit
            </Button>
            }
              <Alert
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
                message='Thank you for RSVP!'
              />
              <Alert
                open={this.state.error}
                onRequestClose={this.handleRequestClose}
                message='Error, you did not provide a response.'
              />
            </CardActions>
          </div>
        </Card>
      </div>
    )
  }
}

Rsvp.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    currentEvent: state.event.currentEvent
  }
}

export default compose(
  withStyles(styles, {
    name: 'Rsvp'
  }), connect(mapStateToProps)
)(Rsvp)
