import { OnboardingLayout } from '$common';
import { Button } from '$ui/button';

function CreateOrJoinClan() {
  return (
    <OnboardingLayout title="Create or join a clan">
      <div className="flex flex-col space-y-4">
        <Button
          variant="outline"
          className="flex h-auto flex-col items-start rounded-lg p-6"
        >
          <h4 className="mb-1 text-xl">Create a clan</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Start a new clan and invite your friends
          </p>
        </Button>
        <Button
          disabled
          variant="outline"
          className="flex h-auto flex-col items-start rounded-lg p-6"
        >
          <h4 className="mb-1 text-xl">Join a clan</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Coming soon!
          </p>
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default CreateOrJoinClan;
