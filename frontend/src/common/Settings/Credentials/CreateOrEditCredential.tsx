import { Fragment, useEffect, useMemo } from 'react';

import { Field, Form, FormikContext, useFormik } from 'formik';

import { type CreateCredentialsData, type CredentialsData } from '$api/account';
import {
  emptyScopes,
  type Scopes,
  scopesFromString,
  scopesToString,
} from '$helpers/credentials';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { Label } from '$ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '$ui/sheet';

import useCredentialsContext from './CredentialsContext';
import SelectScope from '../../Credentials/SelectScope';
import Loading from '../../Loading';

export type Props = {
  open: boolean;
  editingCredential?: CredentialsData;
  onOpenChange: (open: boolean) => void;
  onCreateSuccess?: (createdCredential: CreateCredentialsData) => void;
  onEditSuccess?: (name: string, scope: string) => void;
};

type CreateOrEditCredentialsFormValues = {
  name: string;
  scope: Scopes;
};

function CreateOrEditCredential({
  editingCredential,
  onCreateSuccess,
  onEditSuccess,
  ...props
}: Props) {
  const { createPending, editPending, createCredentials, editCredentials } =
    useCredentialsContext();

  const initialValues = useMemo(
    () => ({
      name: editingCredential?.name || '',
      scope: editingCredential
        ? scopesFromString(editingCredential.scope)
        : { ...emptyScopes },
    }),
    [editingCredential],
  );

  const formik = useFormik<CreateOrEditCredentialsFormValues>({
    initialValues,
    onSubmit: async (values) => {
      const scope = scopesToString(values.scope);

      if (editingCredential) {
        await editCredentials({
          clientId: editingCredential.clientId,
          name: values.name,
          scope,
        });

        onEditSuccess?.(values.name, scope);
      } else {
        const createdCredential = await createCredentials({
          name: values.name,
          scope,
        });

        onCreateSuccess?.(createdCredential);
      }

      props.onOpenChange(false);
    },
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
  }, [initialValues]);

  const handleClose = () => props.onOpenChange(false);

  const submitContent = (() => {
    if (createPending || editPending) {
      return (
        <Fragment>
          <Loading size={20} className="mr-1 inline" />
          {editingCredential ? 'Saving changes...' : 'Creating credential...'}
        </Fragment>
      );
    }

    return editingCredential ? 'Save changes' : 'Create credential';
  })();

  return (
    <Sheet {...props}>
      <SheetContent className="w-full sm:max-w-screen-sm md:max-w-md xl:max-w-xl">
        <FormikContext.Provider value={formik}>
          <SheetHeader>
            <SheetTitle>
              {editingCredential ? 'Update Credential' : 'Create Credential'}
            </SheetTitle>
            <SheetDescription>
              {editingCredential
                ? 'Update an existing credential. Changing the scope might affect the functionality of external services using this credential.'
                : 'Credentials are used to authenticate with external services.'}
            </SheetDescription>
          </SheetHeader>
          <Form className="mt-6">
            <h3 className="mb-4 font-medium">Details</h3>
            <div className="flex flex-col space-y-4">
              {editingCredential && (
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    type="text"
                    value={editingCredential.clientId}
                    readOnly
                  />
                  <p className="text-sm text-gray-500">
                    This value cannot be edited.
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="name">Name</Label>
                <Field id="name" name="name" type="text" as={Input} />
              </div>
            </div>
            <h3 className="mb-4 mt-6 font-medium">Scopes</h3>
            <SelectScope />
            <SheetFooter className="mt-6">
              <Button type="submit">{submitContent}</Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </SheetFooter>
          </Form>
        </FormikContext.Provider>
      </SheetContent>
    </Sheet>
  );
}

export default CreateOrEditCredential;
