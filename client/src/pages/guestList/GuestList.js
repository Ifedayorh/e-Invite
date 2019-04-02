import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../../utils/Api'

import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Grid from '@material-ui/core/Grid'
import Slide from '@material-ui/core/Slide'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'

import PageHeader from '../../components/PageHeader'

import compose from 'recompose/compose'
import { connect } from 'react-redux'

// const for style
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
  spaceBottom: {
    marginBottom: theme.spacing.unit
  },
  TableCell: { textAlign: 'center' },
  Avatar: { backgroundColor: '#009688' },
  FaceIcon: { color: 'white' },
  paperRoot: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  }),
  leftIcon: {
    marginRight: theme.spacing.unit
  }
})

function Transition (props) {
  return <Slide direction='up' {...props} />
}

class GuestList extends Component {
  // set initial state
  state = {
    allGuest: [],
    newDialog: false,
    editDialog: false,
    id: '',
    name: '-',
    party: '',
    email: ''
  }

  // mount component
  componentDidMount () {
    this.loadGuest()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.currentEvent) {
      if (nextProps.currentEvent._id !== this.props.currentEvent._id) {
        API.getGuestByEvent(nextProps.currentEvent._id)
        .then(res => this.setState({ allGuest: res.data.guest }))
        .catch(err => console.log(err))
      }
    }
  }

  // handle call all guest
  loadGuest = () => {
    API.getGuestByEvent(this.props.currentEvent._id)
      .then(res => this.setState({ allGuest: res.data.guest }))
      .catch(err => console.log(err))
  }

  // handle data that want to edit
  editGuest = id => {
    API.getGuestId(id)
      .then(res => this.setState({
        'id': res.data._id,
        'name': res.data.guestName,
        'party': res.data.guestParty,
        'email': res.data.guestEmail
      }, this.editDialogOpen))
      .catch(err => console.log(err))
  }

  // handle delete a guest with the given id
  deleteGuest = id => {
    API.deleteGuest(id)
      .then(res => this.loadGuest())
      .catch(err => console.log(err))
  }

  // open new guest modal
  newDialogOpen = () => {
    this.setState({ newDialog: true })
  }

  // close new guest modal
  newDialogClose = () => {
    this.setState({
      'newDialog': false, 'id': '', 'name': '', 'party': '', 'email': ''
    })
  }

  // open edit guest modal
  editDialogOpen = () => {
    this.setState({ editDialog: true })
  }

  // close edit guest modal
  editDialogClose = () => {
    this.setState({
      'editDialog': false, 'id': '', 'name': '', 'party': '', 'email': ''
    })
  }

  // handle input changes
  handleInputChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  // Handle saves a guest to the database then close modal and call all guest
  saveGuest = () => {
    if (this.state.name && this.state.party && this.state.email) {
      API.saveGuest({ guestName: this.state.name, guestParty: this.state.party, guestEmail: this.state.email, eventId: this.props.currentEvent._id })
        .then(res => this.loadGuest(), this.newDialogClose())
        .catch(err => console.log(err))
    }
  }

  // Handle saves edited data to the database then close modal and call all guest
  editSave = id => {
    let data = {'guestName': this.state.name, 'guestParty': this.state.party, 'guestEmail': this.state.email}
    API.updateGuest(id, data)
    .then(res => this.loadGuest(), this.editDialogClose())
      .catch(err => console.log(err))
  }

  // handle RSVP toggle
  rsvpToggle = (id, rsvp) => (event, checked) => {
    API.updateGuest(id, {'rsvp': !rsvp})
    .then(res => this.loadGuest())
      .catch(err => console.log(err))
  }

  // handle EMAIL toggle
  emailToggle = (id, emailed) => (event, checked) => {
    API.updateGuest(id, {'emailed': !emailed})
    .then(res => this.loadGuest())
      .catch(err => console.log(err))
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <PageHeader title='Guest List' body='Manage your Guest List!' />
        <Button variant='contained' color='primary'
          onClick={this.newDialogOpen}>
          <PersonAddIcon className={classes.leftIcon} />
              Add a Guest
        </Button>

        <Paper className={classes.paperRoot} elevation={4}>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell><Typography type='subheading' gutterBottom>NAME</Typography></TableCell>
                <TableCell><Typography type='subheading' gutterBottom>PARTY</Typography></TableCell>
                <TableCell><Typography type='subheading' gutterBottom>RSVP</Typography></TableCell>
                <TableCell><Typography type='subheading' gutterBottom>INVITE</Typography></TableCell>
                <TableCell><Typography type='subheading' gutterBottom>CONTACT</Typography></TableCell>
                <TableCell><Typography type='subheading' gutterBottom>EDIT</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.allGuest.map(n => {
                return (
                  <TableRow key={n._id}>
                    <TableCell>{n.guestName}</TableCell>
                    <TableCell>{n.guestParty}</TableCell>
                    <TableCell>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={n.rsvp}
                              onChange={this.rsvpToggle(n._id, n.rsvp)} />
                          }
                          label={n.rsvp ? 'Yes' : 'No '} />
                      </FormGroup>
                    </TableCell>
                    <TableCell>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={n.emailed}
                              onChange={this.emailToggle(n._id, n.emailed)} />
                          }
                          label={'Sent'} />
                      </FormGroup>
                    </TableCell>
                    <TableCell>{n.guestEmail}</TableCell>
                    <TableCell>
                      <Tooltip title='Edit' placement='left'>
                        <IconButton onClick={() => this.editGuest(n._id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete' placement='right'>
                        <IconButton onClick={() => this.deleteGuest(n._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={this.state.newDialog} onClose={this.newDialogClose} TransitionComponent={Transition}>
          <DialogTitle>New Guest</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.spaceBottom}>
             You can add a new guest information here
           </DialogContentText>
            <form noValidate autoComplete='off'>
              <Grid container spacing={24}>
                <Grid item xs={12} md={6}>
                  <TextField
                    autoFocus
                    margin='dense'
                    name='name'
                    label='Guest Name'
                    fullWidth
                    onChange={this.handleInputChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin='dense'
                    type='number'
                    name='party'
                    inputProps={{min: 0}}
                    label='No. of Party'
                    fullWidth
                    onChange={this.handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin='dense'
                    name='email'
                    label='Email Address'
                    type='email'
                    fullWidth
                    onChange={this.handleInputChange} />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.newDialogClose} color='primary'>
             Cancel
           </Button>
            <Button onClick={this.saveGuest} color='primary'>
             Submit
           </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.editDialog} onClose={this.editDialogClose} transition={Transition}>
          <DialogTitle>Edit Guest</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.spaceBottom}>
              You can edit the guest here
            </DialogContentText>
            <Grid container spacing={24}>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='dense'
                  name='name'
                  label='Guest Name'
                  fullWidth
                  value={this.state.name}
                  onChange={this.handleInputChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='dense'
                  type='number'
                  name='party'
                  inputProps={{min: 0}}
                  label='No. of Party'
                  fullWidth
                  value={this.state.party}
                  onChange={this.handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin='dense'
                  name='email'
                  label='Email'
                  type='email'
                  fullWidth
                  value={this.state.email}
                  onChange={this.handleInputChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.editDialogClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.editSave(this.state.id)} color='primary'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}

GuestList.propTypes = {
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
    name: 'GuestList'
  }), connect(mapStateToProps)
)(GuestList)
