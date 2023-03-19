import { env } from '@config/env';

import { server } from './shared/infra/http/app';

server.listen(env.PORT, () => {
  console.info(`🚀 Server started on port ${env.PORT}!`);
});
