import * as core from '@actions/core';
import { AppRunnerClient, DescribeServiceCommand } from '@aws-sdk/client-apprunner';

try
{
  //Setup
  const arn = core.getInput(`app-arn`);
  const desiredStatus = core.getInput(`desired-status`).toUpperCase();

  const allowedStatuses = [
    `CREATE_FAILED`,
    `RUNNING`,
    `DELETED`,
    `DELETE_FAILED`,
    `PAUSED`,
    `OPERATION_IN_PROGRESS`,
  ];

  if(!allowedStatuses.includes(desiredStatus))
  {
    throw new Error(`ERROR - 'desired-status' input must be one of the following: '${allowedStatuses.join(`' , '`)}'`);
  }

  const minSleepTime = 5000;
  const sleepTime = Math.min(parseInt(core.getInput(`timeout`)), minSleepTime);

  const minTimeout = 0;
  const timeout = Math.min(parseInt(core.getInput(`timeout`)), minTimeout);

  const client = new AppRunnerClient({
    region: core.getInput(`aws-region`),
    credentials: {
      accessKeyId: core.getInput(`aws-access-key-id`),
      secretAccessKey: core.getInput(`aws-secret-access-key`)
    }
  });

  const command = new DescribeServiceCommand({ ServiceArn: arn });

  const startTime = Date.now();

  //Run

  let success = false;

  while(timeout === 0 || startTime + timeout < Date.now())
  {
    const response = await client.send(command);
    const responseStatus = response.Service.Status;

    if(responseStatus === desiredStatus)
    {
      console.log(`SUCCESS - Status is desired '${desiredStatus}'`);
      success = true;
      break;
    }
    else
    {
      console.log(`CONTINUE - Status is '${responseStatus}'`);
    }

    await new Promise(resolve => setTimeout(resolve, sleepTime));
  }

  //Outputs

  core.setOutput(`timed-out`, !success);
}
catch(err)
{
  core.setFailed(err.message);
}