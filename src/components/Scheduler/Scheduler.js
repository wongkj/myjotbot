import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule'
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data'
import './Scheduler.css'
import { 
    makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles({    
  container: {
    paddingTop: '4em',
    marginLeft: '2em',
    marginRight: '2em'
  }
})

function Scheduler() {

    const classes = useStyles()

  const remoteData = new DataManager({
    url: 'Home/GetData',
    adaptor: new UrlAdaptor,
    crudUrl: 'Home/UpdateData',
    crossDomain: true
  })

  return (
    <div className="App">
      <div className={classes.container}>
        <ScheduleComponent 
            currentView='Month' 
            // selectedDate={ new Date(2017, 5, 5) }
            // eventSettings={{ dataSource: remoteData }}
        >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
      </div>
    </div>
  );
}

export default Scheduler;
