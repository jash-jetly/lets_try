var _a = await supabase.from('profiles').select('*').limit(1), data = _a.data, error = _a.error;
