import Joi from 'joi';

export type SignInWithGooglePayload = {
  token: string;
};

export const signInWithGoogleSchema = Joi.object<SignInWithGooglePayload>({
  token: Joi.string().required(),
});
