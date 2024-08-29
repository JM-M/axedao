import GroupLocation from '@/components/GroupLocation';
import { GroupsQueryParams, verificationStatuses } from '@/hooks/useGroupList';
import { City } from '@/store/cities.store';
import { Country } from '@/store/countries.store';
import { Input } from '@nextui-org/input';
import { AutocompleteProps, Select, SelectItem } from '@nextui-org/react';
import { capitalize } from 'lodash';
import { Search } from 'lucide-react';
import { SetValues, Values } from 'nuqs';

type Props = {
  query: Values<GroupsQueryParams>;
  setQuery: SetValues<GroupsQueryParams>;
};
const Filters = ({ query, setQuery }: Props) => {
  const { searchTerm } = query;

  const setSearchTerm = (searchTerm: string) => setQuery({ searchTerm });
  const setCountry = (country: Country | null) => setQuery({ country: country?.name || null });
  const setCity = (city: City | null) => {
    if (city) {
      const { name, stateCode } = city;
      let cityName = name;
      if (stateCode) cityName += `, ${stateCode}`;
      setQuery({ city: cityName });
    } else {
      setQuery({ city: null });
    }
  };

  const locationProps: Omit<AutocompleteProps, 'children'> = {
    labelPlacement: 'outside' as const,
    className: 'w-min min-w-48',
  };

  return (
    <>
      <div className="flex items-center gap-3 justify-end flex-wrap">
        <Select
          label="Verification"
          labelPlacement="outside"
          className="w-32 text-sm"
          onSelectionChange={(v) => {
            const values = Array.from(v);
            let verified = null;
            if (values.length) {
              if (values[0] === 'verified') verified = true;
              if (values[0] === 'unverified') verified = false;
            }
            setQuery({ verified });
          }}
        >
          {verificationStatuses.map((status) => {
            return <SelectItem key={status}>{capitalize(status)}</SelectItem>;
          })}
        </Select>
        <GroupLocation
          onCountryChange={setCountry}
          onCityChange={setCity}
          countriesProps={{ label: 'Search countries', ...locationProps }}
          citiesProps={{ label: 'Search cities', ...locationProps }}
        />
      </div>
      <div className="flex h-fit flex-col items-start justify-start gap-3 md:flex-row md:items-end">
        <Input
          isClearable
          onClear={() => setSearchTerm('')}
          className="w-full"
          placeholder="Search groups by name"
          startContent={<Search className="h-4 w-4" />}
          labelPlacement="outside"
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </>
  );
};
export default Filters;
