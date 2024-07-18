import CyInput from './CyberUi/CyInput';
import SvgIcon from './SvgIcon';
import CyDrawer from './CyberUi/CyDrawer';
import ProfileCard from './CyberUi/ProfileCard';
import ProfileTabs from './CyberUi/ProfileTabs';
import ECharts from './ECharts';
import CyPagination from './CyberUi/CyPagination';
import CySelect from './CyberUi/CySelect';
import CyDatePicker from './CyberUi/CyDatePicker';
import CyTable from './ProTable';
const components = [SvgIcon, CyInput, CyDrawer, CyDatePicker, ProfileCard, ProfileTabs, ECharts, CyPagination, CySelect, CyTable];

export default {
  install(app: any) {
    components.forEach(cmp => {
      app.component(cmp.name, cmp);
    });
  }
};
