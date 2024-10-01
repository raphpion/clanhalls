import { Fragment, useId, useMemo } from 'react';

import { type CheckedState } from '@radix-ui/react-checkbox';
import { Field, useFormikContext } from 'formik';

import { CredentialScopes, type Scopes } from '$helpers/credentials';
import { Checkbox } from '$ui/checkbox';
import { Label } from '$ui/label';

type FormValues = {
  scope: Scopes;
};

type ParentScopeProps = {
  prefix: string;
  label: string;
  description: string;
};

type ScopeProps = {
  name: CredentialScopes;
  label: string;
  description: string;
};

function ParentScope({ prefix, label, description }: ParentScopeProps) {
  const id = useId();
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const checked = useMemo(
    () =>
      Object.values(CredentialScopes)
        .filter((scope) => scope.startsWith(prefix))
        .every((scope) => values.scope[scope]),
    [prefix, values],
  );

  const handleCheckedChange = (checked: CheckedState) => {
    const newScopes = values.scope;
    Object.values(CredentialScopes)
      .filter((scope) => scope.startsWith(prefix))
      .forEach((scope) => {
        newScopes[scope] = checked === true;
      });

    setFieldValue('scope', { ...newScopes });
  };

  return (
    <Fragment>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </Fragment>
  );
}

function Scope({ name, label, description }: ScopeProps) {
  const id = useId();
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <Fragment>
      <div className="flex items-center space-x-2">
        <Field
          id={id}
          as={Checkbox}
          name={name}
          checked={values.scope[name]}
          className="ml-5"
          onCheckedChange={(checked: CheckedState) =>
            setFieldValue(`scope.${name}`, checked)
          }
        />
        <Label htmlFor={id} className="font-normal">
          {label}
        </Label>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </Fragment>
  );
}

function SelectScope() {
  return (
    <div className="grid grid-cols-[min-content_1fr] gap-x-8 gap-y-4">
      <ParentScope
        prefix="clan"
        label="clan"
        description="Full control of the user's clan"
      />
      <Scope
        name={CredentialScopes.CLAN_REPORTING}
        label="clan:reporting"
        description="Send reports on behalf of the user's clan"
      />
    </div>
  );
}

export default SelectScope;
