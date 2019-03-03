import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { TimePicker, DatePicker } from 'material-ui-pickers'
import Button from '@material-ui/core/Button'
import API from '../utils/Api'
import classNames from 'classnames'
import orange from '@material-ui/core/colors/orange'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import Slide from '@material-ui/core/Slide'
import PagesIcon from '@material-ui/icons/Pages'
import * as actionTypes from '../store/actions/'

import compose from 'recompose/compose'
import { connect } from 'react-redux'

const styles = theme => ({
  paper: {
    padding: '10px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dayWrapper: {
    position: 'relative'
  },
  day: {
    width: 36,
    height: 36,
    fontSize: 14,
    margin: '0 2px',
    color: theme.palette.text.primary
  },
  customDayHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '2px',
    right: '2px',
    border: '2px solid #6270bf',
    borderRadius: '50%'
  },
  nonCurrentMonthDay: {
    color: '#BCBCBC'
  },
  highlightNonCurrentMonthDay: {
    color: '#676767'
  },
  highlight: {
    background: '#9fa8da'
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  },
  dateCenter: {
    margin: '0 auto'
  },
  button: {
    margin: theme.spacing.unit
  },
  raisedAccent: {
    backgroundColor: orange[700]
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  spaceBottom: {
    marginBottom: theme.spacing.unit
  }
})

function Transition (props) {
  return <Slide direction='up' {...props} />
}

class addEvent extends React.Component {
  state = {
    name: '',
    location: '',
    description: '',
    selectedDate: new Date(),
    selectedTime: new Date(),
    open: false,
    nameLimit: false,
    descriptionLimit: false,
    maxName: 20,
    maxDescription: 280
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleDateChange = date => {
    this.setState({
      selectedDate: date
    })
  }

  handleTimeChange = time => {
    this.setState({
      selectedTime: time
    })
  }

  nameWordCount = () => {
    return `${this.state.maxName - this.state.name.length}`
  }
  descriptionWordCount = () => {
    return `${this.state.maxDescription - this.state.description.length}`
  }

  handleChange = name => event => {
    let value = event.target.value
    if (name === 'name') {
      if (value.length >= this.state.maxName) {
        value = value.slice(0, this.state.maxName)
        this.setState.nameLimit = true
      }
    } else if (name === 'description') {
      if (value.length >= this.state.maxDescription) {
        value = value.slice(0, this.state.maxDescription)
        this.setState.descriptionLimit = true
      }
    }
    this.setState({
      [name]: value
    })
  }

  onSubmit = (userId) => {
    let eventData = {
      eventName: this.state.name,
      description: this.state.description,
      location: this.state.location,
      date: this.state.selectedDate,
      time: this.state.selectedTime,
      userId: userId
    }
    this.setState({
      name: '',
      location: '',
      description: ''
    })
    API.saveEvent(eventData)
    .then(res => {
      API.getEventByUserId(userId)
      .then(result => {
        this.props.onUpdateAllEvents(result.data)
        this.props.onUpdateCurrentEvent(result.data[0], 0)
      })
    })
    this.setState({ open: false })
  }

  render () {
    const { selectedDate, selectedTime } = this.state
    const { classes, auth } = this.props
    return (

      <span>
        <Button onClick={this.handleClickOpen} className={classNames(classes.button, classes.raisedAccent)} variant='contained' color='primary'>
          <PagesIcon className={classes.leftIcon} />
          New Event
        </Button>
        <Dialog open={this.state.open} onClose={this.handleRequestClose} transition={Transition}>
          <DialogTitle>New Event</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.spaceBottom}>
             Start a memorable event!
           </DialogContentText>
            <div>
              <form noValidate autoComplete='off'>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id='name'
                      label='Name'
                      value={this.state.name}
                      onChange={this.handleChange('name')}
                      fullWidth
                      helperText={this.nameWordCount()}
                      disabled={this.state.nameLimit}
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id='location'
                      label='Location'
                      value={this.state.location}
                      onChange={this.handleChange('location')}
                      fullWidth
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label='Date'
                      value={selectedDate}
                      onChange={this.handleDateChange}
                      animateYearScrolling={false}
                      leftArrowIcon='<'
                      rightArrowIcon='>'
                      fullWidth
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TimePicker
                      label='Time'
                      value={selectedTime}
                      onChange={this.handleTimeChange}
                      fullWidth
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id='description'
                      label='Event Description'
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={this.state.description}
                      multiline
                      onChange={this.handleChange('description')}
                      placeholder="What's the event about?"
                      fullWidth
                      helperText={this.descriptionWordCount()}
                      disabled={this.state.descriptionLimit}
                      margin='dense'
                    />
                  </Grid>
                </Grid>
              </form>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.onSubmit(auth.profile.sub)} color='primary' component={Link} to='/dashboard'>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </span>

    )
  }
}

addEvent.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateAllEvents: (events) => dispatch(actionTypes.updateAllEvents(events)),
    onUpdateCurrentEvent: (eventId, selectedIndex) => dispatch(actionTypes.updateCurrentEvent(eventId, selectedIndex))
  }
}

export default compose(
  withStyles(styles, {
    name: 'addEvent'
  }), connect(mapStateToProps, mapDispatchToProps)
)(addEvent)
