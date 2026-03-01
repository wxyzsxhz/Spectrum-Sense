import child from '../models/child.js';
import { notFoundError, serverError } from './error.js';
import axios from 'axios';
import { ageInMonths } from '../utils/months.js';
import test from '../models/test.js';

export const testASD = async (req, res) => {
    const AQReverse = ['Q1', 'Q2', 'Q4', 'Q5', 'Q6','Q9', 'Q10', 'Q11', 'Q17', 'Q18', 'Q25', 'Q26', 'Q30'];
    const MReverse = ['Q11', 'Q18', 'Q20', 'Q22'];
    const categoriesAQ = {
        socialSkills : ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
        attentionSwitching : ['Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'],
        attentionToDetails : ['Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18'],
        communication : ['Q19', 'Q20', 'Q21', 'Q22', 'Q23', 'Q24', 'Q25'],
        imagination : ['Q26', 'Q27', 'Q28', 'Q29', 'Q30']
    };
    const categoriesM = {
        social: ['Q2', 'Q4', 'Q9', 'Q10', 'Q12', 'Q13', 'Q14', 'Q17', 'Q19', 'Q23'],   
        communication: [ 'Q6', 'Q7', 'Q15', 'Q20', 'Q21'],
        behavior: ['Q5', 'Q11', 'Q18', 'Q22'],    
        motor: ['Q1', 'Q3', 'Q8', 'Q16']
    };
    const percentPerCategoryAQ = {
        socialSkills : 0,
        attentionSwitching : 0,
        attentionToDetails : 0,
        communication : 0,
        imagination : 0
    };
    const percentPerCategoryM = {
        social : 0,
        communication : 0,
        behavior : 0,
        motor : 0,
    }
    let percentPerCategory = {};
    try {
        const id = req.id;
        const childId = req.params.childId;
        
        const screeningData = req.body;
        switch(Object.keys(screeningData).length){
            case 30 : {
                AQReverse.forEach(answer => {
                    if(screeningData.hasOwnProperty(answer)){
                        screeningData[answer] = 3-screeningData[answer];
                    }
                });
                Object.keys(categoriesAQ).forEach(category => {
                    categoriesAQ[category].forEach(answer => {
                        percentPerCategoryAQ[category] += screeningData[answer]*100/(categoriesAQ[category].length*3)
                        console.log(`${category} : ${percentPerCategoryAQ[category]}`);
                    });
                });
                percentPerCategory = percentPerCategoryAQ;
            }break;
            case 23 : {
                Object.keys(categoriesM).forEach(category => {
                    categoriesM[category].forEach(answer => {
                        if (MReverse.includes(answer)){
                            switch (screeningData[answer]){
                                case 'yes' : percentPerCategoryM[category] += 100/(categoriesM[category].length);break;
                            }
                            console.log(`${category} : ${percentPerCategoryM[category]}`);
                        }else{
                            switch(screeningData[answer]){
                                case 'no' : percentPerCategoryM[category] += 100/(categoriesM[category].length);break;
                            }
                            console.log((`${category} : ${percentPerCategoryM[category]}`));
                        }
                        
                    });
                });
                percentPerCategory = percentPerCategoryM;
            }break;
            default : {
                return res.status(400).json({message : 'Corrupt Assessment Form'});
            }
        }

        const childData = await child.findById(childId).select('age gender dateOfBirth familyWithASD jaundice');
        if(!childData)
            notFoundError(res, 'Child not found');
        screeningData.Age = ageInMonths(childData.dateOfBirth);
        screeningData.Gender = childData.gender;
        screeningData.Jaundice = childData.jaundice? 'yes' : 'no';
        screeningData.Family_ASD_History = childData.familyWithASD? 'yes' : 'no';
        // Just send the raw form data - API handles everything!
        const response = await axios.post(
            'http://localhost:5000/predict',
            screeningData,
            { headers: { 'Content-Type': 'application/json' } }
          );
        switch (response.status) {
            case 400||401:
                return res.status(response.status).json({message : response.message});
            case 500:
                serverError(response.error, res);
                break;
            default: {
                // Response has everything you need
                const result = response.data;
                result.percentPerCategory = percentPerCategory;
                result.childId = childId;
                console.log(`Risk: ${result.risk_percentage}%`);
                console.log(`Category: ${result.risk_category}`);
                //console.log(`Recommendation: ${result.interpretation.recommendation}`);
                const newTest = new test(result);
                await newTest.save();
                return res.status(200).json({message : 'Tested successfully', result});
            }
        }
    } catch (err) {
        serverError(err, res);
    }
}

export const getHistory = async (req, res) => {
    try {
        const id = req.id;
        const childId = req.params.childId;
        if(!childId){
            const children = await child.find({guardianId : id}).select('name').lean();

            const childrenWithTests = (await Promise.all(children.map(async (c) => {
                const results = await test.find({ childId: c._id }).select('_id prediction_label risk_percentage risk_category createdAt').lean();
                if(!results||results.length==0) return null;
                return { ...c, tests: results };
            })
            )).filter(c => c!==null);
            return res.status(200).json({message : 'Fetched successfully', children : childrenWithTests})
        }else{
            const c = await child.findById(childId).select('guardianId');
            if (!c)
                notFoundError(res, 'Child not found');
            else if (c.guardianId!=id)
                unauthorizedAccessError(res);
            else {
                const tests = await test.find({childId : c._id}).select('_id prediction_label risk_percentage risk_category createdAt');
                return res.status(200).json({message : 'Fetched successfully', tests});
            }
        } 
    } catch (err) {
        serverError(err,res);
    }      
}

export const getTest = async (req, res) => {
    try {
        const id = req.id;
        const testId = req.params.testId;
        const t = await test.findById(testId).select('-childId -age -age_unit -confidence -prediction -probabilities -__v');
        if(!t) notFoundError(res, 'Test history not found');
        return res.status(200).json({message : 'Fetched successfully', test : t});
    } catch (err) {
        serverError(err, res);
    }

}
