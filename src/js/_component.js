import icons from "./icons.json"
// import React, { Component } from 'react';


class BoostrapIconsComponent extends React.Component{
    constructor(){
        super();

        this.state={
            search:null
        };

        this._handleSearch = this._handleSearch.bind(this);
        this._handleRemove = this._handleRemove.bind(this);
    }

    _handleSearch  (event){
        event.preventDefault();
        let keyword = event.target.value;
        this.setState({search:keyword})
    }
    _handleRemove(){
        this.setState({search:null})
    }

    render(){
        const Icons = icons.data.sort((a, b) => (a.css > b.css) ? 1 : -1)
        const IconsItems =  Icons.filter((data)=>{
            if(this.state.search == null)     {
                return data
            }

            else if(data.css.toLowerCase().includes(this.state.search.toLowerCase()) || data.css.toLowerCase().includes(this.state.search.toLowerCase())){

                return data
            }
        }).map((data,index)=>
            <li className={"col mb-4 icon-item text-center"} key={index} data-tags={data.keyword}>
                <div className="p-3 py-4 mb-2 bg-light text-center rounded"> <i className={"biicon biicon-3x bi-"+data.css}></i></div>
                <span className={"iconName"}> {data.css}</span>
            </li>
        );


        return (
            <div>

                <div className="SearchForm mb-5">
                    <label htmlFor="search-input"><i className="biicon bi-search" aria-hidden="true"></i><span className="sr-only">Search icons</span></label>
                    <input  className="form-control input-lg" placeholder="Search icons" autoComplete="off" value={this.state.search}
                            spellCheck="false" autoCorrect="off" tabIndex="1" onChange={(e)=>this._handleSearch(e)}/>
                    {this.state.search !== null ? <span id="search-clear"  onClick={this._handleRemove} className="biicon bi-x search-clear" aria-hidden="true"><span
                        className="sr-only">Clear search</span></span> : ''}
                </div>
                <h2>{this.state.search == null ? "1000+ Icons" : "Search for '"+this.state.search+"'"}</h2>
                <hr/>
                <ul className={"row row-cols-3 row-cols-sm-4 row-cols-lg-6 row-cols-xl-8 list-unstyled list"}>{IconsItems}</ul>
            </div>
        )
    }

}

export default BoostrapIconsComponent;