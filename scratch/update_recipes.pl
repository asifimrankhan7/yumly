use JSON::PP;
use File::Slurp;

my $json_text = read_file('src/data/recipes.json');
my $json = decode_json($json_text);

my %mapping = (
    v_27 => 'paneer_bhurji.png',
    v_28 => 'methi_malai_mutter.png',
    v_29 => 'sarson_ka_saag.png',
    v_30 => 'aloo_capsicum.png',
    v_31 => 'undhiyu.png',
    v_32 => 'pindi_chole.png',
    v_33 => 'gatte_ki_sabzi.png',
    v_34 => 'soya_chaap_curry.png',
    v_35 => 'cabbage_thoran.png',
    v_36 => 'baby_corn_masala.png'
);

foreach my $r (@$json) {
    if (exists $mapping{$r->{id}}) {
        $r->{images}->{thumbnail} = "../assets/images/recipes/" . $mapping{$r->{id}};
        $r->{images}->{hero} = "../assets/images/recipes/" . $mapping{$r->{id}};
    }
}

write_file('src/data/recipes.json', JSON::PP->new->pretty->encode($json));
