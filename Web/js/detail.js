//////////////////////////////////////
//Initialisation pour les datatables//
//////////////////////////////////////

//Fonction qui initialise les tables apres le chargement du script
function chargeTable(){
    //Tableaux pour : Calculated energies for the frontier molecular orbitals
    $(document).ready(function() {
        $('#calc_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#calc_id_tab').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Most intense Mulliken atomic charges
    $(document).ready(function() {
        $('#mull_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#mull_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Geometry optimization convergence criteria
    $(document).ready(function() {
        $('#opti_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#opti_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Cartesian atomic coordinates
    $(document).ready(function() {
        $('#cartesian_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#cartesian_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Table of the most intense molecular vibrations
    $(document).ready(function() {
        $('#vibration_id').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    $(document).ready(function() {
        $('#vibration_id_table').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );

    //Tableaux pour : Calculated mono-electronic excitations
    $(document).ready(function() {
        $('#excitation_id_card').DataTable( {
            "paging":   false,
            "info":     false,
            "searching":   false,
            "ordering": false,
        } );
    } );
}

//Une fois les scripts chargés on initialise les tables
window.onload = chargeTable();

/////////////////////////////////////////////////////////
//Fonctions utiles pour le traitement du Json et autres//
/////////////////////////////////////////////////////////

//Bouton pour switch de vue Card/Tab
let btn = document.getElementById("switchDiplay");
btn.onclick = function() {
    let icone = document.getElementById("icone");
    let icone2 = document.getElementById("icone2");
    if (document.getElementById("diplay-tab").style.display != "none" && document.getElementById("display-404").style.display == "none"){
        icone.style.display = "none";
        icone2.style.display = "block";
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "block";
    }
    else if (document.getElementById("display-404").style.display == "none") {
        icone.style.display = "block";
        icone2.style.display = "none";
        document.getElementById("diplay-card").style.display = "none";
        document.getElementById("diplay-tab").style.display = "block";
    }
}

//Fonction pour créer une ligne a partir de toutes les colonnes dans un tableau datatable
function createLigne(colonnes){
    let tableau = "<tr>" + colonnes +"</tr>";
    return tableau;
}

//Fonction pour créer une colonne dans un tableau datatable
function createCol(colonne) {
    let col = "<td>" + colonne + "</td>";
    return col;
}

//Fonction pour mettre les indices en html aux formules moléculaires (C6H6)
function mol_sub(molecule){
    let tmp = "";
    for(let i = 0;i<molecule.length;i++){
        //Si le caractère est un chiffre alors on le met en indice
        if (molecule[i].match(/[0-9]/)){
            tmp += molecule[i].sub();
        }
        else {
            tmp += molecule[i];
        }
    }
    return tmp;
}

//Fonction pour mettre les exposants en html sur une expression scientifique (10e-8)
function exposant(chaine){
    try {
        let index;
        let tmp = "";
        chaine = chaine.toString();

        //Récupération de l'index ou se trouve l'exposant "e"
        for(let i = 0;i<chaine.length;i++){
            if (chaine[i].match("e")){
                index = i;
            }
        }

        //On ajoute l'exposant en enlevant le "e"
        let exposant = chaine.substring(index+1);
        tmp += chaine.substring(0,index) ;
        tmp += "×10"
        tmp += exposant.sup();
        return tmp;
    } catch (error) {
        console.error(error);
    }
}

//Récupération de l'url, l'id et construction de l'url de requete
let url = new URL(document.location.href);
let id = url.searchParams.get("id");
let url_api = 'http://127.0.0.1:5000/api/details/';
url_api += id;

//Objet XHR ajax permettant de récupérer des données à partir d'une URL
let requestURL = url_api;
let request = new XMLHttpRequest();

//Fonction pour lire l'état de la requête et si le serveur renvoie le statut 200 OK et l'état Done
//On prends la réponse et on rempli l'HTML avec les informations du Json
request.onreadystatechange = function() {
    //Si la réponse serveur n'est pas correcte on affiche une 404
    if(this.status == 404){
        document.getElementById("display-404").style.display = "block";
        document.getElementById("diplay-tab").style.display = "none";
        document.getElementById("diplay-card").style.display = "none";
    }

    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //On parse la réponse du serveur en JSON
        let response = JSON.parse(this.responseText);
        let Symbol = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc",
                      "Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                      "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm",
                      "Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl",
                      "Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md",
                      "No","Lr","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Uut","Uuq","Uup","Uuh","Uus","Uuo"];

        /////////////////////////////////////////////
        //Fonction pour draw sur le canvas le smile//
        /////////////////////////////////////////////
        function draw_canvas() {
            let input = response.data.molecule.can;
            let options = {
                width: 250,
                height: 250,
            };
            let options2 = {
                width: 282,
                height: 282,
            };

            // Initialize the drawer to draw to canvas
            let smilesDrawer = new SmilesDrawer.Drawer(options);
            let smilesDrawer2 = new SmilesDrawer.Drawer(options2);

            //Affiche des dessins des smiles dans les 2 affichages
            SmilesDrawer.parse(input, function(tree) {
                smilesDrawer.draw(tree, "smile", "light", false);
                }
            );
            /*SmilesDrawer.parse(input, function(tree) {
                    smilesDrawer2.draw(tree, "smile_card", "light", false);
                },function(err){
                    console.log(err);
                }
            );*/
        }

        //Une fois le script pour dessiner les smiles chargé on exécute la fonction pour draw
        if (response.data.molecule.smi){
            window.onload = draw_canvas();
        }

        ////////////////////////////////////////////////////////
        //Onglet Description avec les informations principales//
        ////////////////////////////////////////////////////////

        //Affichage de l'id de la molécule
        if (response.id){
            //On remplit l'id de la molécule
            document.getElementById("mol_id").innerHTML = "Molecule Id : "+ response.id;
            document.getElementById("mol_id_card").innerHTML = "Molecule Id : "+ response.id;
        }

        if (response.data.molecule.formula){
            //On remplit le titre
            document.getElementById("titre").innerHTML = "Formule : "+mol_sub(response.data.molecule.formula);
            document.getElementById("titre_card").innerHTML  = mol_sub(response.data.molecule.formula);
        }

        if(response.data.molecule.iupac){
            document.getElementById("iupac").innerHTML = "<acronym title='International Union of Pure and Applied Chemistry' style='text-decoration: none'>IUPAC :</acronym>" + " "+ response.data.molecule.iupac;
            document.getElementById("iupac_card").innerHTML = response.data.molecule.iupac;
        }
        else{
            document.getElementById("iupac_display").style.display = "none";
            document.getElementById("iupac_display2").style.display = "none";
        }

        if (response.data.molecule.inchi){
            //Substring pour ne pas prendre le début avec "INCHI="
            document.getElementById("inchi").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>" + " " + response.data.molecule.inchi.substring(6);
            document.getElementById("inchi_card").innerHTML = "<acronym title='International Chemical Identifier' style='text-decoration: none'>Inchi :</acronym>";
            document.getElementById("inchibis_card").innerHTML = response.data.molecule.inchi.substring(6);
        }
        else{
            document.getElementById("inchi_display").style.display = "none";
            document.getElementById("inchi_display2").style.display = "none";
        }

        if (response.data.molecule.smi){
            document.getElementById("smiles").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>" + " " + response.data.molecule.smi;
            document.getElementById("smiles_card").innerHTML = "<acronym title='Simplified Molecular-Input Line-Entry System' style='text-decoration: none'>SMILES :</acronym>";
            document.getElementById("smilesbis_card").innerHTML = response.data.molecule.smi;
        }
        else{
            document.getElementById("smiles_display").style.display = "none";
            document.getElementById("smiles_display2").style.display = "none";
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de calcul)
        if (!response.data.comp_details.general){
            document.getElementById("display-comp-detail").style.display = "none";
        }

        if (response.data.comp_details.general.package && response.data.comp_details.general.package_version){
            document.getElementById("software").innerHTML = "Software";
            document.getElementById("softwarebis").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
            document.getElementById("software_card").innerHTML = "Software";
            document.getElementById("softwarebis_card").innerHTML = response.data.comp_details.general.package +" ("+response.data.comp_details.general.package_version+")";
        }
        else{
            document.getElementById("diplay_software").style.display = "none";
            document.getElementById("diplay_software2").style.display = "none";
        }

        if (response.data.comp_details.general.last_theory){
            document.getElementById("computational").innerHTML = "Computational method";
            document.getElementById("computationalbis").innerHTML = response.data.comp_details.general.last_theory;
            document.getElementById("computational_card").innerHTML = "Computational method";
            document.getElementById("computationalbis_card").innerHTML = response.data.comp_details.general.last_theory;
        }
        else{
            document.getElementById("comp_display").style.display = "none";
            document.getElementById("comp_display2").style.display = "none";
        }

        if (response.data.comp_details.general.functional){
            document.getElementById("functional").innerHTML = "Functional";
            document.getElementById("functionalbis").innerHTML = response.data.comp_details.general.functional;
            document.getElementById("functional_card").innerHTML = "Functional";
            document.getElementById("functionalbis_card").innerHTML = response.data.comp_details.general.functional;
        }
        else{
            document.getElementById("func_display").style.display = "none";
            document.getElementById("func_display2").style.display = "none";
        }

        if (response.data.comp_details.general.basis_set_name){
            document.getElementById("basis").innerHTML = "Basis Set Name";
            document.getElementById("basisbis").innerHTML = response.data.comp_details.general.basis_set_name;
            document.getElementById("basis_card").innerHTML = "Basis Set Name";
            document.getElementById("basisbis_card").innerHTML = response.data.comp_details.general.basis_set_name;
        }
        else{
            document.getElementById("basis_display").style.display = "none";
            document.getElementById("basis_display2").style.display = "none";
        }

        if (response.data.comp_details.general.basis_set_size || response.data.comp_details.general.basis_set_size == 0){
            document.getElementById("number_basis").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis").innerHTML = response.data.comp_details.general.basis_set_size;
            document.getElementById("number_basis_card").innerHTML = "Number of basis set functions";
            document.getElementById("number_basisbis_card").innerHTML = response.data.comp_details.general.basis_set_size;
        }
        else{
            document.getElementById("nb_basis_display").style.display = "none";
            document.getElementById("nb_basis_display2").style.display = "none";
        }

        if (response.data.comp_details.general.is_closed_shell){
            document.getElementById("shell_calc").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis").innerHTML = response.data.comp_details.general.is_closed_shell;
            document.getElementById("shell_calc_card").innerHTML = "Closed shell calculation";
            document.getElementById("shell_calcbis_card").innerHTML = response.data.comp_details.general.is_closed_shell;
        }
        else{
            document.getElementById("shell_display").style.display = "none";
            document.getElementById("shell_display2").style.display = "none";
        }

        if (response.data.comp_details.general.integration_grid){
            document.getElementById("integration").innerHTML = "Integration grid";
            document.getElementById("integrationbis").innerHTML = response.data.comp_details.general.integration_grid;
            document.getElementById("integration_card").innerHTML = "Integration grid";
            document.getElementById("integrationbis_card").innerHTML = response.data.comp_details.general.integration_grid;
        }
        else{
            document.getElementById("integration_display").style.display = "none";
            document.getElementById("integration_display2").style.display = "none";
        }

        if (response.data.comp_details.general.solvent){
            document.getElementById("solvent").innerHTML = "Solvent";
            document.getElementById("solventbis").innerHTML = response.data.comp_details.general.solvent;
            document.getElementById("solvent_card").innerHTML = "Solvent";
            document.getElementById("solventbis_card").innerHTML = response.data.comp_details.general.solvent;
        }
        else{
            document.getElementById("solvent_display").style.display = "none";
            document.getElementById("solvent_display2").style.display = "none";
        }

        if (response.data.comp_details.general.scf_targets || response.data.comp_details.general.scf_targets.length == 0){
            let val = response.data.comp_details.general.scf_targets[response.data.comp_details.general.scf_targets.length-1];
            document.getElementById("convergence").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis").innerHTML = exposant(val[0]);
            document.getElementById("convergence_max").innerHTML = "Requested SCF convergence on MAX density";
            document.getElementById("convergence_max_bis").innerHTML = val[1];
            document.getElementById("convergence_energie").innerHTML = "Requested SCF convergence on energy";
            document.getElementById("convergence_energie_bis").innerHTML = val[2];
            document.getElementById("convergence_card").innerHTML = "Requested SCF convergence on RMS density";
            document.getElementById("convergencebis_card").innerHTML = exposant(val[0]);
            document.getElementById("convergence_max_card").innerHTML = "Requested SCF convergence on MAX density";
            document.getElementById("convergencebis_max_card").innerHTML = val[1];
            document.getElementById("convergence_energie_card").innerHTML = "Requested SCF convergence on energy";
            document.getElementById("convergence_energie_bis_card").innerHTML = val[2];
        }
        else{
            document.getElementById("convergence_display").style.display = "none";
            document.getElementById("convergence_display2").style.display = "none";
            document.getElementById("convergence_max_display").style.display = "none";
            document.getElementById("convergence_max_display2").style.display = "none";
            document.getElementById("convergence_energie_display").style.display = "none";
            document.getElementById("convergence_energie_display2").style.display = "none";
        }

        if(response.data.comp_details.freq.temperature || response.data.comp_details.freq.temperature  == 0){
            document.getElementById("temperature").innerHTML = "Temperature";
            document.getElementById("temperaturebis").innerHTML = response.data.comp_details.freq.temperature ;
            document.getElementById("temperature_card").innerHTML = "Temperature";
            document.getElementById("temperaturebis_card").innerHTML = response.data.comp_details.freq.temperature ;
        }
        else{
            document.getElementById("temperature_display").style.display = "none";
            document.getElementById("temperature_display2").style.display = "none";
        }

        if(response.data.comp_details.freq.anharmonicity != null){
            document.getElementById("anharmonicity").innerHTML = "Anharmonic effects";
            document.getElementById("anharmonicitybis").innerHTML = response.data.comp_details.freq.anharmonicity;
            document.getElementById("anharmonicity_card").innerHTML = "Anharmonic effects";
            document.getElementById("anharmonicity_bis_card").innerHTML = response.data.comp_details.freq.anharmonicity;
        }
        else{
            document.getElementById("anharmonicity_display").style.display = "none";
            document.getElementById("anharmonicity_display2").style.display = "none";
        }

        if (response.data.comp_details.excited_states.nb_et_states || response.data.comp_details.excited_states.nb_et_states  == 0){
            document.getElementById("nb_excited_state").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis").innerHTML = response.data.comp_details.excited_states.nb_et_states;
            document.getElementById("nb_excited_state_card").innerHTML = "Number of excited states";
            document.getElementById("nb_excited_statebis_card").innerHTML = response.data.comp_details.excited_states.nb_et_states;
        }
        else{
            document.getElementById("nb_excited_display").style.display = "none";
            document.getElementById("nb_excited_display2").style.display = "none";
        }

        //Partie plus détaillée pour les caractéristiques de la molécule (partie détail de la molécule)
        if (response.data.molecule.formula){
            document.getElementById("formule").innerHTML = "Formule";
            document.getElementById("formulebis").innerHTML = mol_sub(response.data.molecule.formula);
            document.getElementById("formule_card").innerHTML = "Formule";
            document.getElementById("formulebis_card").innerHTML = mol_sub(response.data.molecule.formula);
        }

        if (response.data.molecule.charge || response.data.molecule.charge == 0){
            document.getElementById("charge").innerHTML = "Charge";
            document.getElementById("chargebis").innerHTML = response.data.molecule.charge;
            document.getElementById("charge_card").innerHTML = "Charge";
            document.getElementById("chargebis_card").innerHTML = response.data.molecule.charge;
        }
        else{
            document.getElementById("charge_display").style.display = "none";
            document.getElementById("charge_display2").style.display = "none";
        }

        if (response.data.molecule.multiplicity || response.data.molecule.multiplicity == 0){
            document.getElementById("spin").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis").innerHTML = response.data.molecule.multiplicity;
            document.getElementById("spin_card").innerHTML = "Spin multiplicity";
            document.getElementById("spinbis_card").innerHTML = response.data.molecule.multiplicity;
        }

        if (response.data.molecule.monoisotopic_mass || response.data.molecule.monoisotopic_mass == 0){
            document.getElementById("monoisotopic").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis").innerHTML = response.data.molecule.monoisotopic_mass;
            document.getElementById("monoisotopic_card").innerHTML = "Monoisotopic mass";
            document.getElementById("monoisotopicbis_card").innerHTML = response.data.molecule.monoisotopic_mass;
        }

        //Possibilité de télécharger les informations de la molécule
        if (response.data.metadata.log_file){
            document.getElementById("logfile").innerHTML = "Original log file";
            let logbtn = document.getElementById("logfilebis");
            logbtn.innerHTML = "Download";

            let id = response.id;
            let path = id.split('');
            let name = response.data.metadata.log_file;
            let lien = "";
            for(let i = 0;i<path.length;i++){
                lien += path[i]+"/";
            }
            lien += name;

            logbtn.setAttribute("href",lien);

            document.getElementById("logfile_card").innerHTML = "Original log file";
            let logbtn2 = document.getElementById("logfilebis_card");
            logbtn2.innerHTML = "Download";
            logbtn2.setAttribute("href",lien);
        }

        ////////////////////////////////////////////////////
        //Onglet Results avec le détail et l'ajout d'infos//
        ////////////////////////////////////////////////////

        //Partie WAVEFONCTION
        if(!response.data.results.wavefunction || response.data.results.wavefunction == undefined){
            document.getElementById("v-pills-wavefunction").style.display = "none";
            document.getElementById("v-pills-wavefunction-tab").style.display = "none";
            document.getElementById("wavefunction_display").style.display = "none";
        }

        if (response.data.results.wavefunction.total_molecular_energy || response.data.results.wavefunction.total_molecular_energy == 0){
            document.getElementById("energy").innerHTML = "Total molecular energy";
            document.getElementById("energybis").innerHTML = response.data.results.wavefunction.total_molecular_energy;
            document.getElementById("energy_card").innerHTML = "Total molecular energy";
            document.getElementById("energybis_card").innerHTML = response.data.results.wavefunction.total_molecular_energy;
        }
        else{
            document.getElementById("energy_display").style.display = "none";
            document.getElementById("energy_display2").style.display = "none";
        }

        //Si plusieurs Homos dans l'index on les liste et les affiche
        if (response.data.results.wavefunction.homo_indexes || response.data.results.wavefunction.homo_indexes == 0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let homos = "";
            for(let j=0;j<homo_indexes.length;j++){
                homos += (homo_indexes[j]+1);
                if(j!=(homo_indexes.length-1))
                    homos +=", ";
            }
            document.getElementById("homo").innerHTML = "HOMO number";
            document.getElementById("homobis").innerHTML = homos;
            document.getElementById("homo_card").innerHTML = "HOMO number";
            document.getElementById("homobis_card").innerHTML = homos;
        }
        else {
            document.getElementById("homo_display").style.display = "none";
            document.getElementById("homo_display2").style.display = "none";
        }

        //Remplissage du tableau des HOMOS
        if(response.data.results.wavefunction.MO_energies && response.data.results.wavefunction.MO_energies.length>0){
            let homo_indexes = response.data.results.wavefunction.homo_indexes;
            let MO_energies = response.data.results.wavefunction.MO_energies;
            let ligne = "";
            for(let j=0;j<homo_indexes.length;j++){
                if (homo_indexes[j] <= 0) {
                    ligne += createLigne(createCol(N/A) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]+1].toFixed(2)) + createCol(N/A));
                } else {
                    //ligne += createLigne(createCol(MO_energies[j][homo_indexes[j] - 1].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j]].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j] + 1].toFixed(2)) + createCol(MO_energies[j][homo_indexes[j] + 2].toFixed(2)));
                    ligne += createLigne(createCol(MO_energies[j][3].toFixed(2)) + createCol(MO_energies[j][4].toFixed(2)) + createCol(MO_energies[j][5].toFixed(2)) + createCol(MO_energies[j][6].toFixed(2)));

                }
            }
            document.getElementById("calc_table_tab").innerHTML = ligne;
            document.getElementById("calc_table_card").innerHTML = ligne;
        }
        else{
            document.getElementById("calculated_energies").style.display = "none";
            document.getElementById("calculated_energies2").style.display = "none";
        }

        //Remplissage du tableau Mulliken atomic
        if (response.data.results.wavefunction.Mulliken_partial_charges && response.data.results.wavefunction.Mulliken_partial_charges.length>0) {
            let Mulliken_partial_charges = response.data.results.wavefunction.Mulliken_partial_charges;

            //On reprends les différents champs du tableau (Atome, indices et charges partielles)
            let atoms_Z = response.data.molecule.atoms_Z;
            let atom_z = new Array();
            for (let j = 0; j < atoms_Z.length; j++){
                atom_z[j] = atoms_Z[j];
            }

            let indices = new Array();
            for (let j = 0; j < Mulliken_partial_charges.length; j++){
                indices[j] = j;
            }

            let mulliken_partial_charges = new Array();
            for (let j = 0; j < Mulliken_partial_charges.length; j++) {
                mulliken_partial_charges[j] = Mulliken_partial_charges[j];
            }

            //Tri des energies dans le tableau
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                for (let h = j; h < (mulliken_partial_charges.length - 1); h++) {
                    if (mulliken_partial_charges[h] < mulliken_partial_charges[j]) {
                        let temp = mulliken_partial_charges[h];
                        let temp0 = indices[h];
                        let temp1 = atom_z[h];

                        mulliken_partial_charges[h] = mulliken_partial_charges[j];
                        indices[h] = indices[j];
                        atom_z[h] = atom_z[j];
                        mulliken_partial_charges[j] = temp;
                        indices[j] = temp0;
                        atom_z[j] = temp1;
                    }
                }
            }

            //Calcul de la moyenne
            let sum = 0;
            for (let j = 0; j < mulliken_partial_charges.length; j++){
                sum += mulliken_partial_charges[j];
            }

            let moyenne = sum / mulliken_partial_charges.length;

            //calcule de l'écart type
            sum = 0;
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                let inter = mulliken_partial_charges[j] - moyenne;
                sum += Math.pow(inter, 2);
            }
            let std = Math.sqrt(sum / mulliken_partial_charges.length);

            //remplissage de la moyenne
            document.getElementById("moyenne").innerHTML = "Mean = " + moyenne.toFixed(3) + " , Standard Deviation(std) = " + std.toFixed(3);
            document.getElementById("moyenne_card").innerHTML = "Mean = " + moyenne.toFixed(3) + " , Standard Deviation(std) = " + std.toFixed(3);

            //remplissage du tableau
            let html = "";
            let thres_max = moyenne + std;
            let thres_min = moyenne - std;
            for (let j = 0; j < mulliken_partial_charges.length; j++) {
                if (mulliken_partial_charges.length < 5){
                    html +=  createLigne(createCol(Symbol[atom_z[j] - 1]) + createCol(indices[j]) + createCol(mulliken_partial_charges[j].toFixed(3)));
                }
                else if ((mulliken_partial_charges[j] > thres_max) || (mulliken_partial_charges[j] < thres_min)) {
                    html += createLigne(createCol(Symbol[atom_z[j] - 1]) + createCol(indices[j]) + createCol(mulliken_partial_charges[j].toFixed(3)));
                }
            }

            document.getElementById("mulliken_table").innerHTML = html;
            document.getElementById("mulliken_table_card").innerHTML = html;
        }
        else{
            document.getElementById("mulliken_charges").style.display = "none";
            document.getElementById("mulliken_charges_card").style.display = "none";
        }

        //Partie GEOMETRY
        if(!response.data.results.geometry || response.data.results.geometry == undefined){
            document.getElementById("v-pills-geometry").style.display = "none";
            document.getElementById("v-pills-geometry-tab").style.display = "none";
            document.getElementById("geometry_display").style.display = "none";
        }

        if (response.data.results.geometry.nuclear_repulsion_energy_from_xyz || response.data.results.geometry.nuclear_repulsion_energy_from_xyz == 0){
            document.getElementById("nuclear").innerHTML = "Nuclear repulsion energy in atomic units";
            document.getElementById("nuclearbis").innerHTML = response.data.results.geometry.nuclear_repulsion_energy_from_xyz;
        }
        else{
            document.getElementById("nuclear_display").style.display = "none";
        }

        //si le logiciel utilisé est gaussian on affiche les cibles géométriques dans la partie geometry
        if(response.data.comp_details.general.package && (response.data.comp_details.general.package=="Gaussian")){
            if(response.data.comp_details.geometry.geometric_targets){
                let html = "";
                let geometric_targets = response.data.comp_details.geometry.geometric_targets;
                let geometric_values = response.data.results.geometry.geometric_values[response.data.results.geometry.geometric_values.length -1 ];
                let titreCols = ["Maximum Force","RMS Force","Maximum Displacement","RMS Displacement"];

                for(let i=0;i<geometric_targets.length && i< titreCols.length;i++){
                    html += createLigne(createCol(titreCols[i]) + createCol(geometric_values[i].toFixed(6)) + createCol(geometric_targets[i].toFixed(6)));
                }

                document.getElementById("opti_table").innerHTML = html;
                document.getElementById("opti_table_card").innerHTML = html;
            }
            else{
                document.getElementById("geometry_opti").style.display = "none";
                document.getElementById("geometry_opti_card").style.display = "none";
            }
        }


        //Coordonnées cartésiennes
        if(response.data.results.geometry.elements_3D_coords_converged){
            let elements_3D_coords_converged = response.data.results.geometry.elements_3D_coords_converged;
            let atoms_Z = response.data.molecule.atoms_Z;
            let html = "";

            for(let i=0;i<elements_3D_coords_converged.length;i+=3){
                html += createLigne(createCol(Symbol[atoms_Z[i/3]-1]) + createCol(elements_3D_coords_converged[i].toFixed(4)) + createCol(elements_3D_coords_converged[i+1].toFixed(4)) + createCol(elements_3D_coords_converged[i+2].toFixed(4)));
            }

            document.getElementById("cartesian_table").innerHTML = html;
            document.getElementById("cartesian_table_card").innerHTML = html;
        }
        else{
            document.getElementById("cartesian_tab").style.display = "none";
            document.getElementById("cartesian_card").style.display = "none";
        }

        //Partie THERMOCHEMISTRY
        if(!response.data.results.freq || response.data.results.freq.length == undefined){
            document.getElementById("v-pills-thermochemistry").style.display = "none";
            document.getElementById("v-pills-thermochemistry-tab").style.display = "none";
            document.getElementById("thermochemistry_display").style.display = "none";
        }

        if(response.data.results.freq.zero_point_energy){
            document.getElementById("zero_point_value").innerHTML = response.data.results.freq.zero_point_energy;
            document.getElementById("zero_point_value_card").innerHTML = response.data.results.freq.zero_point_energy;
        }
        else{
            document.getElementById("zero_point").style.display = "none";
            document.getElementById("zero_point_card").style.display = "none";
        }

        if(response.data.results.freq.electronic_thermal_energy){
            document.getElementById("elec_energie_value").innerHTML = response.data.results.freq.electronic_thermal_energy;
            document.getElementById("elec_energie_value_card").innerHTML = response.data.results.freq.electronic_thermal_energy;
        }
        else{
            document.getElementById("elec_energie").style.display = "none";
            document.getElementById("elec_energie_card").style.display = "none";
        }

        if(response.data.results.freq.entropy){
            document.getElementById("entropy_value").innerHTML = response.data.results.freq.entropy;
            document.getElementById("entropy_value_card").innerHTML = response.data.results.freq.entropy;
        }
        else{
            document.getElementById("entropy").style.display = "none";
            document.getElementById("entropy_card").style.display = "none";
        }

        if(response.data.results.freq.enthalpy){
            document.getElementById("enthalpy_value").innerHTML = response.data.results.freq.enthalpy;
            document.getElementById("enthalpy_value_card").innerHTML = response.data.results.freq.enthalpy;
        }
        else{
            document.getElementById("enthalpy").style.display = "none";
            document.getElementById("enthalpy_card").style.display = "none";
        }

        if(response.data.results.freq.free_energy){
            document.getElementById("free_energy_value").innerHTML = response.data.results.freq.free_energy;
            document.getElementById("free_energy_value_card").innerHTML = response.data.results.freq.free_energy;
        }
        else{
            document.getElementById("free_energy").style.display = "none";
            document.getElementById("free_energy_card").style.display = "none";
        }

        //Remplissage du tableau des vibrations
        if(response.data.results.freq.vibrational_int){
            let vibrational_freq = response.data.results.freq.vibrational_freq;
            let vibrational_int = response.data.results.freq.vibrational_int;
            let vibrational_sym = response.data.results.freq.vibrational_sym;
            let html = "";
            let nbRes = 0;

            for(let i=0;i<vibrational_int.length;i++){
                if(vibrational_int.length < 5){
                    html +=  createLigne( createCol(vibrational_freq[i]) + createCol(vibrational_int[i]) + createCol(vibrational_sym[i]));
                    nbRes++;
                }else if(vibrational_int[i] > 20){
                    html += createLigne(createCol(Math.round(vibrational_freq[i])) + createCol(Math.round(vibrational_int[i])) + createCol(vibrational_sym[i]));
                    nbRes++;
                }
            }
            document.getElementById("vibration_table").innerHTML = html;
            document.getElementById("vibration_table_card").innerHTML = html;
        }
        else{
            document.getElementById("vibration_tab").style.display = "none";
            document.getElementById("vibration_tab_card").style.display = "none";
        }

        //Partie sur les EXCITED STATES
        if(!response.data.results.excited_states.et_energies || response.data.results.excited_states.et_energies == {}){
            document.getElementById("v-pills-states").style.display = "none";
            document.getElementById("v-pills-states-tab").style.display = "none";
            document.getElementById("excitation_card").style.display = "none";
        }

        if(response.data.results.excited_states.et_energies) {
            let et_energies = response.data.results.excited_states.et_energies;
            let inde = new Array();
            let html = "";

            for (let i = 0; i < et_energies.length; i++) {
                inde[i] = i + 1;
            }

            let et_sym = response.data.results.excited_states.et_sym;
            let et_oscs = response.data.results.excited_states.et_oscs;
            let et_rot = response.data.results.excited_states.et_rot;

            for (let i = 0; i < et_energies.length; i++) {
                let nm = 10000000 / et_energies[i];

                if (et_rot[i]) {
                    html += createLigne(createCol(inde[i]) + createCol(Math.round(et_energies[i])) + createCol(Math.round(nm)) + createCol(et_sym[i]) + createCol(et_oscs[i].toFixed(4)) + createCol(et_rot[i].toFixed(4)));
                } else {
                    html += createLigne(createCol(inde[i]) + createCol(Math.round(et_energies[i])) + createCol(Math.round(nm)) + createCol(et_sym[i]) + createCol(et_oscs[i].toFixed(4)) + createCol("Unknown"));
                }
            }
            document.getElementById("excitation_table").innerHTML = html;
            document.getElementById("excitation_table_card").innerHTML = html;
        }
        else{
            document.getElementById("excitation_display").style.display = "none";
            document.getElementById("excitation_display_card").style.display = "none";
        }
    }
};

request.open('GET', requestURL);
request.send();