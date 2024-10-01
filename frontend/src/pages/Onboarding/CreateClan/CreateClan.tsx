import { useEffect, useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Field, Form, FormikProvider, useFormik } from 'formik';
import { CheckIcon, XIcon } from 'lucide-react';
import * as yup from 'yup';

import { createClan, verifyClanNameAvailability } from '$api/account';
import Loading from '$common/Loading';
import OnboardingLayout from '$common/OnboardingLayout';
import { usePageTitle } from '$hooks';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { Label } from '$ui/label';

type CreateClanFormValues = {
  name: string;
  nameAvailable: boolean | undefined;
};

function CreateClan() {
  const navigate = useNavigate();
  usePageTitle('Create a clan');

  const verifyClanNameAvailabilityMutation = useMutation({
    mutationKey: ['verify-clan-name-availability'],
    mutationFn: (name: string) => verifyClanNameAvailability(name),
  });

  const createClanMutation = useMutation({
    mutationKey: ['create-clan'],
    mutationFn: (name: string) => createClan(name),
    onSuccess: () => {
      navigate({ to: '/onboarding/sync-clan' });
    },
  });

  const formik = useFormik<CreateClanFormValues>({
    initialValues: {
      name: '',
      nameAvailable: undefined,
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required('Please enter a name.')
        .min(3, 'Name must be at least 3 characters.')
        .max(25, 'Name must be at most 25 characters.'),
      nameAvailable: yup.boolean().required().nullable(),
    }),
    onSubmit: async ({ name }) => createClanMutation.mutateAsync(name),
  });

  useEffect(() => {
    (async () => {
      formik.setFieldValue('nameAvailable', null);
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        return;
      }

      const data = await verifyClanNameAvailabilityMutation.mutateAsync(
        formik.values.name,
      );
      formik.setFieldValue('nameAvailable', data.available);
    })();
  }, [formik.values.name]);

  const nameHelpLabel = useMemo(() => {
    if (formik.touched.name && formik.errors.name)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          {formik.errors.name}
        </Label>
      );

    if (formik.values.nameAvailable === false)
      return (
        <Label className="px-3 text-left text-red-500">
          <XIcon size={16} className="mr-1 inline" />
          Name not available!
        </Label>
      );

    if (verifyClanNameAvailabilityMutation.isPending)
      return (
        <Label className="px-3 text-left text-yellow-500">
          <Loading size={16} className="mr-1 inline" />
          Verifying name availability...
        </Label>
      );

    if (formik.values.nameAvailable)
      return (
        <Label className="px-3 text-left text-green-500">
          <CheckIcon size={16} className="mr-1 inline" />
          Name available!
        </Label>
      );
  }, [
    formik.touched.name,
    formik.values.nameAvailable,
    formik.errors.name,
    verifyClanNameAvailabilityMutation.isPending,
  ]);

  return (
    <OnboardingLayout title="Create a clan">
      <p className="mb-8">
        Welcome to Clan Halls! First, let's create your clan and synchronize it
        with in-game data.
      </p>
      <FormikProvider value={formik}>
        <Form className="flex w-full max-w-sm flex-col space-y-2">
          <Field name="name" type="text" placeholder="Name" as={Input} />
          {nameHelpLabel}
          <div className="flex flex-row justify-center space-x-4 pt-4">
            {createClanMutation.isPending ? (
              <Loading />
            ) : (
              <Button type="submit" disabled={!formik.isValid}>
                Create clan
              </Button>
            )}
          </div>
        </Form>
      </FormikProvider>
    </OnboardingLayout>
  );
}

export default CreateClan;
