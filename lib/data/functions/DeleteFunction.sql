CREATE OR REPLACE FUNCTION "DeleteFunction"(_name text)
  returns void As
$func$
BEGIN

EXECUTE(SELECT string_agg(format('DROP FUNCTION %s(%s);', oid::regproc, pg_catalog.pg_get_function_identity_arguments(oid)),E'\n')
FROM pg_proc
where proname = _name
AND pg_function_is_visible(oid));

END
$func$ LANGUAGE plpgsql;
