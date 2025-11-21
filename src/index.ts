import app from './presentation/app';
import './infraestructure/database';
import { envs } from './config/envs';

app.listen(envs.port, () => {
  console.log(`Server is running on http://${envs.host}:${envs.port}`);
});
