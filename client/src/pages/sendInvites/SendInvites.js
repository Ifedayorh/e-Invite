import React from 'react'
import PropTypes from 'prop-types'
import {
  withStyles
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Alert from '../../components/Alert'
import API from '../../utils/Api'
import PageHeader from '../../components/PageHeader'
import SendIcon from '@material-ui/icons/Send'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Slide from '@material-ui/core/Slide'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'

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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  alerts: {
    top: 80
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: theme.spacing.unit
  },
  paperRoot: theme.mixins.gutters({
    marginTop: theme.spacing.unit * 3
  }),
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
})

function Transition (props) {
  return <Slide direction='up' {...props} />
}

class SendInvites extends React.Component {
  state = {
    to: '',
    subject: 'Event Name',
    message: `Hi, you are invited to my event! 
Please click on the link to let me know if you can make it!`,
    error: false,
    emailsSent: false,
    emailURL: process.env.REACT_APP_EMAIL_LINK,
    guests: [],
    open:false
  }

  componentDidMount () {
    if (this.props.currentEvent) {
      this.setState({subject: this.props.currentEvent.eventName})
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentEvent._id !== this.props.currentEvent._id) {
      this.setState({subject: nextProps.currentEvent.eventName})
    }
  }
  validateEmail = (email) => {
    let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (reg.test(email)) {
      return true
    } else {
      return false
    }
  }

  handleRequestClose = () => {
    this.setState({ error: false, emailsSent: false })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleCheckChange = name => (event, checked) => {
    this.setState({ [name]: checked })
  }

  importOpen = () => {
    API.getGuestByEvent(this.props.currentEvent._id)
    .then((res) => {
      this.setState({ guests: res.data.guest })
      for (let i in res.data.guest) {
        this.setState({ [res.data.guest[i]._id]: false })
      }
    })
    this.setState({ open: true })
  }

  importClose = () => {
    this.setState({
      open: false
    })
  }

  onImport = () => {
    var newTo = this.state.to
    for (let i in this.state.guests) {
      if (this.state[this.state.guests[i]._id]) {
        if (newTo === '') {
          newTo += this.state.guests[i].guestEmail
        } else {
          newTo += ';' + this.state.guests[i].guestEmail
        }
      }
    }
    this.setState({
      to: newTo
    })
    this.importClose()
  }

  onSend = () => {
    this.setState({emailsSent: false})
    let emailArray = this.state.to.split(';')

    for (let i in emailArray) {
      if (!this.validateEmail(emailArray[i].trim())) {
        this.setState({error: true})
        return
      }
    }
    this.setState({error: false})

    for (let i in emailArray) {
      let email = {
        to: emailArray[i],
        subject: this.state.subject,
        message: this.state.message,
        url: this.state.emailURL,
        eventId: this.props.currentEvent._id
      }
      API.sendEmail(email)
      .then((data) => {
        this.setState({emailsSent: true})
      })
      .catch((err) => {
        if (err) throw err
      })
    }
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <PageHeader title='Send Invites' body={`An email will be sent to your guest to RSVP!`} />
        <Button variant='contained' color='primary'
          onClick={this.importOpen}>
          <ImportContactsIcon className={classes.leftIcon} />
          Import Guests
        </Button>
        <Dialog open={this.state.open} onClose={this.importClose} transition={Transition}>
          <DialogTitle>Import Guests</DialogTitle>
          <DialogContent>
            <div>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Select Guests</FormLabel>
                <FormGroup>
                  {
                      this.state.guests.map(guestObject => {
                        return (
                          <FormControlLabel
                            key={guestObject._id}
                            control={
                              <Checkbox
                                checked={this.state[[guestObject._id]]}
                                onChange={this.handleCheckChange(guestObject._id)}
                                name={guestObject._id}
                                value={guestObject._id}
                              />
                              }
                            label={guestObject.guestName
                            ? guestObject.guestEmail + ' (' + guestObject.guestName + ')' : guestObject.guestEmail}
                          />
                        )
                      })
                  }
                </FormGroup>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.importClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.onImport} color='primary'>
              Import
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={4}>
          <form className={classes.container} noValidate autoComplete='off'>
            <TextField
              label='To'
              placeholder='Separate emails by semicolons'
              value={this.state.to}
              className={classes.textField}
              fullWidth
              margin='normal'
              onChange={this.handleChange('to')}
            />
            <TextField
              id='subject'
              label='Subject'
              value={this.state.subject}
              className={classes.textField}
              margin='normal'
              fullWidth
              onChange={this.handleChange('subject')}
            />
            <TextField
              id='message'
              label='Message'
              multiline
              rows='10'
              fullWidth
              value={this.state.message}
              className={classes.textField}
              margin='normal'
              onChange={this.handleChange('message')}
              />
            <div className={classes.button}>
              <Button variant='contained' color='primary' onClick={this.onSend} >
                <SendIcon className={classes.leftIcon} />
                Send
              </Button>
            </div>
          </form>
          <Alert
            open={this.state.error}
            onClose={this.handleRequestClose}
            message='Error: Make sure all you entered all emails correctly'
        />
          <Alert
            open={this.state.emailsSent}
            onClose={this.handleRequestClose}
            message='Invite(s) were sent!'
        />
        </Paper>
      </div>
    )
  }
}

SendInvites.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    currentEvent: state.event.currentEvent
  }
}

export default compose(
  withStyles(styles, {
    name: 'SendInvites'
  }), connect(mapStateToProps)
)(SendInvites)
