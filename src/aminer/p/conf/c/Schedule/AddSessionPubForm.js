import { message } from 'antd';
import { AutoForm } from 'amg/ui/form';
import { page } from 'acore';

const dict = {
  default: 'AddSchedulePubsByIds',
  add: 'AddConfPubs',
  del: 'DelConfPubs',
  bestPaper: 'UpdateBestPaper',
};
const AddSessionPubForm = props => {
  const { dispatch, sche_id, getAllList, confInfo, type = 'default' } = props;

  const SubmitPubs = ({ pub_ids }, { setSubmitting }) => {
    setSubmitting(false);
    if (pub_ids) {
      const payload = {
        conf_id: confInfo.id,
        pids: pub_ids.split(/[,，；;.。]/g),
      };
      if (sche_id) {
        payload.sid = sche_id;
      }
      dispatch({
        type: `aminerConf/${dict[type]}`,
        payload,
      }).then(res => {
        if (res) {
          message.success('add pub success');
          dispatch({ type: 'modal/close' });
          getAllList && getAllList();
        } else {
          message.error('error');
        }
      });
    }
  };

  return (
    <div style={{ maxHeight: '50vh' }}>
      <AutoForm
        config={[
          {
            name: 'pub_ids',
            label: '论文ID',
            type: 'textarea',
            autoSize: true,
            placeholder: '多个id请用逗号分隔',
          },
        ]}
        data={{ pub_ids: '' }}
        onSubmit={SubmitPubs}
        showReset={false}
      />
    </div>
  );
};
export default page()(AddSessionPubForm);
