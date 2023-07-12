# AppRunner Status Listener Action

This action awaits for a specific status of the AppRunner service or times out, giving you control of the deployment

## Access Rights

The account that is provided to the action needs the `apprunner:DescribeService` right.

## Inputs

### `aws-access-key-id`

**Required** AWS Authentication Data.

### `aws-secret-access-key`

**Required** AWS Authentication Data.

### `aws-region`

**Required** AWS Authentication Data.

### `app-arn`

**Required** AppRunner service ARN.

### `desired-status`

**Required** Desired AppRunner service status, validated against official documentation at https://docs.aws.amazon.com/apprunner/latest/api/API_Service.html.

### `sleep-time`

Sleep time between requests to the AWS API in ms. Default and minimum `5000`.

### `timeout`

Timeout in ms. `0` means no timeout. Default `30000`.

## Outputs

### `timed-out`

`true` if the desired status wasn't received before the timeout occurred

## Example usage

#### Right after successful ECR push, we wait for the auto deployment to start:

```yaml
uses: r4ven1245/apprunner-status-listener-action@v1.0.6
with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
    app-arn: ${{ env.APP_RUNNER_ARN }}
    desired-status: 'OPERATION_IN_PROGRESS'
    timeout: 15000
```

#### After the previous action use succeeds, we can now wait for the successful deployment of the AppRunner service to finish:

```yaml
uses: r4ven1245/apprunner-status-listener-action@v1.0.6
with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
    app-arn: ${{ env.APP_RUNNER_ARN }}
    desired-status: 'RUNNING'
    sleep-time: 10000
    timeout: 600000
```
